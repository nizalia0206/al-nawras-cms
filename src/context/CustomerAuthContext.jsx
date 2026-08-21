import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("customers").select("*").eq("id", userId).maybeSingle();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user?.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      loadProfile(sess?.user?.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  async function register({ fullName, email, phone, company, password }) {
    if (!supabaseConfigured) return { error: { message: "Supabase is not configured yet." } };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error };

    // Save the customer profile row. If email confirmation is switched on in
    // Supabase, there is no session yet — the row is inserted on first sign-in
    // instead (see signIn below), since RLS requires auth.uid() = id.
    if (data.session) {
      const { error: profileError } = await supabase.from("customers").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        phone,
        company,
      });
      if (profileError) return { error: profileError };
      await loadProfile(data.user.id);
    }

    return { error: null, needsEmailConfirmation: !data.session };
  }

  async function signIn(email, password) {
    if (!supabaseConfigured) return { error: { message: "Supabase is not configured yet." } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    // Backfill the customers row for anyone who signed up before this table
    // existed, or whose insert was deferred pending email confirmation.
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();
    if (!existing) {
      await supabase.from("customers").upsert({
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || "",
        email: data.user.email,
      });
    }
    await loadProfile(data.user.id);
    return { error: null };
  }

  async function signOut() {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
    setProfile(null);
  }

  async function updateProfile(fields) {
    if (!supabaseConfigured || !session?.user?.id) {
      return { error: { message: "You must be signed in." } };
    }
    const { error } = await supabase.from("customers").update(fields).eq("id", session.user.id);
    if (!error) await loadProfile(session.user.id);
    return { error };
  }

  return (
    <CustomerAuthContext.Provider
      value={{
        session,
        profile,
        loading: session === undefined,
        register,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used inside <CustomerAuthProvider>");
  return ctx;
}

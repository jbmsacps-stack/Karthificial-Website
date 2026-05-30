const SUPABASE_URL = "https://djqbjehuyenoeckgivkn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcWJqZWh1eWVub2Vja2dpdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTQ5ODAsImV4cCI6MjA5NTE5MDk4MH0.AWc1TYdinmD-tF8_-ZrlIOKkAlte_CdfCuOJfwEflbg";

window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase connected:", window.supabaseClient);
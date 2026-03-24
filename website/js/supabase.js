const { createClient } = window.supabase;

const sb = createClient(
  "https://pypnzsrontpqlecgdlsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cG56c3JvbnRwcWxlY2dkbHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjY4NTMsImV4cCI6MjA4ODIwMjg1M30.qv12smBYt1QNLHXxsYSsupIbletkJnMTMx6iNPo-UZw"
);

window.sb = sb;

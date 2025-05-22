import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabaseAdmin = createClient(
  "https://sradowdmvmulklyenthz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyYWRvd2Rtdm11bGtseWVudGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTk4ODcxNCwiZXhwIjoyMDYxNTY0NzE0fQ.8NHDeJiPVLt6TB6Eghnr3n8bGyU4GYuXCuEOLeuC84k"
);

app.delete("/delete-account", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  const supabase = createClient(
    "https://sradowdmvmulklyenthz.supabase.co",
    token
  );
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return res.status(401).json({ error: "Invalid token" });

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  );
  if (deleteError) return res.status(500).json({ error: deleteError.message });

  return res.status(200).json({ message: "Account deleted successfully" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

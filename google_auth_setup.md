# How to Get Google Client ID and Secret

To enable "Sign in with Google", you need to create a project in the Google Cloud Console.

## Step 1: Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top-left and select **"New Project"**.
3.  Name it (e.g., "Fostride Auth") and click **Create**.

## Step 2: Configure OAuth Consent Screen
1.  In the left sidebar, go to **APIs & Services > OAuth consent screen**.
2.  Select **External** (unless you are a Google Workspace user only) and click **Create**.
3.  Fill in the required fields:
    *   **App Name**: "Fostride" (or your app name).
    *   **User Support Email**: Your email.
    *   **Developer Contact Information**: Your email.
4.  Click **Save and Continue** through the "Scopes" and "Test Users" sections (defaults are fine for now).

## Step 3: Create Credentials
1.  Go to **APIs & Services > Credentials** in the left sidebar.
2.  Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
3.  **Application type**: Select **Web application**.
4.  **Name**: "Supabase Auth" (or similar).
5.  **Authorized redirect URIs**:
    *   Click **+ ADD URI**.
    *   Paste the **Callback URL** from your Supabase Dashboard.
    *   *To find this URL:* Go to Supabase > Authentication > Providers > Google. It looks like: `https://<your-project-id>.supabase.co/auth/v1/callback`.
6.  Click **Create**.

## Step 4: Copy Keys to Supabase
1.  A popup will show your **Client ID** and **Client Secret**.
2.  Copy these.
3.  Go back to your **Supabase Dashboard > Authentication > Providers > Google**.
4.  Paste them into the corresponding fields.
5.  Click **Save**.

🎉 Done! Your Google Sign-In button should now work.

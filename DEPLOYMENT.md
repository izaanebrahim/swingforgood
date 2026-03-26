# Deploying SwingForGood to Vercel

SwingForGood is built with Next.js, and Vercel is the easiest and most optimized place to host it. Follow these steps to deploy your platform completely free!

## 1. Push Code to GitHub
First, you need to push your local repository to GitHub.
1. Create a new empty repository on [GitHub](https://github.com/new).
2. Open your VS Code terminal and run:
   ```bash
   git add .
   git commit -m "Initial commit of SwingForGood"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 2. Connect Your Database (Supabase)
Before deploying, make sure you have your Production database ready:
1. Go to [Supabase](https://supabase.com/dashboard), create a new project.
2. In the Supabase SQL Editor, paste and run the contents of `supabase/schema.sql` to create all the tables like `users`, `scores`, `charities`, etc.
3. Keep your **Project URL**, **Anon Key**, and **Service Role Key** handy.

## 3. Set Up Stripe
1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
2. Grab your `Publishable key` and `Secret key`.
3. Create two Products (Monthly Plan: £9.99, Yearly Plan: £89.99) and copy their **Price IDs**.

## 4. Deploy to Vercel
1. Log in to [Vercel](https://vercel.com/) (you can sign up with GitHub).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. Open the **Environment Variables** section before clicking "Deploy". Add these variables to match what you have locally:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   STRIPE_MONTHLY_PRICE_ID=your-monthly-price-id
   STRIPE_YEARLY_PRICE_ID=your-yearly-price-id

   NEXT_PUBLIC_APP_URL=your-future-vercel-domain.vercel.app
   ```
5. Click **Deploy**. Vercel will install dependencies, build the project, and put it live on the internet!

## 5. Stripe Webhooks (Once Deployed)
1. Go back to Stripe > Developers > Webhooks.
2. Add an Endpoint pointing to `https://your-vercel-domain.vercel.app/api/stripe/webhook`.
3. Select the events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`.
4. Grab the **Signing Secret (whsec_...)** and update your `STRIPE_WEBHOOK_SECRET` environment variable in the Vercel Settings. Redeploy to apply!

Congratulations! Your SwingForGood platform is now live!

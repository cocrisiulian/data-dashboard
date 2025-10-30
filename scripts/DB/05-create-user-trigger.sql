-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Get the Free plan ID
  SELECT id INTO free_plan_id FROM public.plans WHERE name = 'Free' LIMIT 1;

  -- Insert new user profile with Free plan
  INSERT INTO public.users (id, email, full_name, plan_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    free_plan_id
  )
  ON CONFLICT (id) DO NOTHING;

  -- Log the signup
  INSERT INTO public.usage_logs (user_id, action, details)
  VALUES (
    NEW.id,
    'user_signup',
    jsonb_build_object('email', NEW.email)
  );

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

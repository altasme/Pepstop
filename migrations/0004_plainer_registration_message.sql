-- Plainer wording for the sign-up confirmation. Only changes the message if it still has the original default text.
UPDATE site_settings SET value = 'Your account is created.

Thanks for signing up with The Pep Stop. Message or call us to say you are in, and we will review your account.

Once it is approved, log in and you can see our products and prices.'
 WHERE key = 'registration_message' AND value = 'Your account has been created!

Thank you for registering with The Pep Stop.

Your account is currently awaiting approval. Please contact The Pep Stop and let our team know that you have created an account and are waiting for approval.

Once your account has been reviewed and approved by our administrator, you will be able to log in and view the product catalog.';

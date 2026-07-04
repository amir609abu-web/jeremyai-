-- Switch billing provider from Stripe to Paddle
ALTER TABLE "User" RENAME COLUMN "stripeCustomerId" TO "paddleCustomerId";
ALTER TABLE "User" RENAME COLUMN "stripeSubscriptionId" TO "paddleSubscriptionId";
ALTER TABLE "User" DROP COLUMN "stripePaymentMethodId";

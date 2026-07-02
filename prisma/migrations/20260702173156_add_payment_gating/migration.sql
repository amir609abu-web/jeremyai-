-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedTermsAt" DATETIME NOT NULL,
    "acceptedTermsVersion" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripePaymentMethodId" TEXT,
    "hasPaymentMethod" BOOLEAN NOT NULL DEFAULT true,
    "trialEndsAt" DATETIME
);
INSERT INTO "new_User" ("acceptedTermsAt", "acceptedTermsVersion", "createdAt", "email", "id", "isAdmin", "name", "passwordHash") SELECT "acceptedTermsAt", "acceptedTermsVersion", "createdAt", "email", "id", "isAdmin", "name", "passwordHash" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

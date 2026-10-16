BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE "Order" ADD COLUMN "extraCharge" INTEGER;

COMMIT;

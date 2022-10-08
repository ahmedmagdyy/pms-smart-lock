-- CreateTable
CREATE TABLE "unit" (
    "id" BIGSERIAL NOT NULL,
    "unit_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" BIGSERIAL NOT NULL,
    "unit_id" BIGINT NOT NULL,
    "guest_name" VARCHAR(255) NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "is_cancelled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lock" (
    "id" BIGSERIAL NOT NULL,
    "unit_id" BIGINT NOT NULL,
    "remote_lock_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_code" (
    "id" BIGSERIAL NOT NULL,
    "passcode" VARCHAR(255) NOT NULL,
    "remote_passcode_id" VARCHAR(255) NOT NULL,
    "unit_id" BIGINT NOT NULL,
    "lock_id" BIGINT NOT NULL,
    "reservation_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" BIGSERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unit_unit_name_key" ON "unit"("unit_name");

-- CreateIndex
CREATE UNIQUE INDEX "lock_unit_id_key" ON "lock"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "lock_remote_lock_id_key" ON "lock"("remote_lock_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_code_unit_id_key" ON "access_code"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_code_lock_id_key" ON "access_code"("lock_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_code_reservation_id_key" ON "access_code"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_token_key" ON "token"("token");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lock" ADD CONSTRAINT "lock_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_lock_id_fkey" FOREIGN KEY ("lock_id") REFERENCES "lock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_code" ADD CONSTRAINT "access_code_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

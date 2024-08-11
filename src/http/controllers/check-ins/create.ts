import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateGymUsecase } from "@/usecases/factories/make-create-gym-usecase";
import { makeCheckInUsecase } from "@/usecases/factories/make-check-in-usecase";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const checkInUsecase = makeCheckInUsecase();

  await checkInUsecase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send({ message: "User created" });
}

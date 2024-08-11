import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateGymUsecase } from "@/usecases/factories/make-create-gym-usecase";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);

  const createGymUsecase = makeCreateGymUsecase();

  await createGymUsecase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send({ message: "User created" });
}

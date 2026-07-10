import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { TrainerRequest } from '../middlewares/trainer.js';
import { successResponse, errorResponse } from '../utils/response.js';
import * as trainerService from './trainerService.js';

function getTrainer(req: Request) {
  return (req as TrainerRequest).trainer!;
}

function getUser(req: Request) {
  return (req as AuthenticatedRequest).user!;
}

export async function listClients(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const clients = await trainerService.getClients(trainerId);
    res.json(successResponse(clients));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch clients'));
  }
}

export async function getClientDetailsHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const client = await trainerService.getClientDetails(clientId);
    res.json(successResponse(client));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch client details';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function addClientHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const { clientUserId } = req.body;
    const client = await trainerService.addClient(trainerId, clientUserId);
    res.status(201).json(successResponse(client, 'Client added'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add client';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function removeClientHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const clientId = req.params.clientId as string;
    await trainerService.removeClient(trainerId, clientId);
    res.json(successResponse(null, 'Client removed'));
  } catch {
    res.status(500).json(errorResponse('Failed to remove client'));
  }
}

export async function getClientProgressHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const progress = await trainerService.getClientProgress(clientId);
    res.json(successResponse(progress));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch progress';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function listPlans(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const plans = await trainerService.getPlans(trainerId);
    res.json(successResponse(plans));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch plans'));
  }
}

export async function createPlanHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const plan = await trainerService.createPlan(trainerId, req.body);
    res.status(201).json(successResponse(plan, 'Plan created'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create plan';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getPlanDetailsHandler(req: Request, res: Response) {
  try {
    const planId = req.params.planId as string;
    const plan = await trainerService.getPlanDetails(planId);
    res.json(successResponse(plan));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch plan';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function updatePlanHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const planId = req.params.planId as string;
    const plan = await trainerService.updatePlan(planId, trainerId, req.body);
    res.json(successResponse(plan, 'Plan updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update plan';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function deletePlanHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const planId = req.params.planId as string;
    await trainerService.deletePlan(planId, trainerId);
    res.json(successResponse(null, 'Plan deleted'));
  } catch {
    res.status(500).json(errorResponse('Failed to delete plan'));
  }
}

export async function assignPlanHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const planId = req.params.planId as string;
    const { clientIds } = req.body;
    const result = await trainerService.assignPlan(trainerId, planId, clientIds);
    res.json(successResponse(result, 'Plan assigned'));
  } catch {
    res.status(500).json(errorResponse('Failed to assign plan'));
  }
}

export async function getClientPlansHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const plans = await trainerService.getClientPlans(clientId);
    res.json(successResponse(plans));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch client plans';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getCalendarHandler(req: Request, res: Response) {
  try {
    const { id: coachId, userId } = getTrainer(req);
    const { dateFrom, dateTo } = req.query as Record<string, string | undefined>;
    const events = await trainerService.getCalendar(coachId, userId, dateFrom, dateTo);
    res.json(successResponse(events));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch calendar'));
  }
}

export async function createCalendarEventHandler(req: Request, res: Response) {
  try {
    const { userId } = getTrainer(req);
    const event = await trainerService.createCalendarEvent(userId, req.body);
    res.status(201).json(successResponse(event, 'Event created'));
  } catch {
    res.status(500).json(errorResponse('Failed to create event'));
  }
}

export async function updateCalendarEventHandler(req: Request, res: Response) {
  try {
    const { userId } = getTrainer(req);
    const eventId = req.params.eventId as string;
    const event = await trainerService.updateCalendarEvent(eventId, userId, req.body);
    res.json(successResponse(event, 'Event updated'));
  } catch {
    res.status(500).json(errorResponse('Failed to update event'));
  }
}

export async function deleteCalendarEventHandler(req: Request, res: Response) {
  try {
    const { userId } = getTrainer(req);
    const eventId = req.params.eventId as string;
    await trainerService.deleteCalendarEvent(eventId, userId);
    res.json(successResponse(null, 'Event deleted'));
  } catch {
    res.status(500).json(errorResponse('Failed to delete event'));
  }
}

export async function getClientCalendarHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const events = await trainerService.getClientCalendar(clientId);
    res.json(successResponse(events));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch client calendar';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getClientNutritionHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const nutrition = await trainerService.getClientNutrition(clientId);
    res.json(successResponse(nutrition));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch nutrition';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function addClientMealHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const meal = await trainerService.addClientMeal(clientId, req.body);
    res.status(201).json(successResponse(meal, 'Meal added'));
  } catch {
    res.status(500).json(errorResponse('Failed to add meal'));
  }
}

export async function getClientWaterHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const water = await trainerService.getClientWater(clientId);
    res.json(successResponse(water));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch water intake';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getClientWeightHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const weight = await trainerService.getClientWeight(clientId);
    res.json(successResponse(weight));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch weight';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getConversationsHandler(req: Request, res: Response) {
  try {
    const { id } = getUser(req);
    const conversations = await trainerService.getConversations(id);
    res.json(successResponse(conversations));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch conversations'));
  }
}

export async function getConversationMessagesHandler(req: Request, res: Response) {
  try {
    const conversationId = req.params.conversationId as string;
    const messages = await trainerService.getConversationMessages(conversationId);
    res.json(successResponse(messages));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch messages'));
  }
}

export async function sendMessageHandler(req: Request, res: Response) {
  try {
    const { id } = getUser(req);
    const conversationId = req.params.conversationId as string;
    const { content } = req.body;
    const message = await trainerService.sendMessage(conversationId, id, content);
    res.status(201).json(successResponse(message, 'Message sent'));
  } catch {
    res.status(500).json(errorResponse('Failed to send message'));
  }
}

export async function startConversationHandler(req: Request, res: Response) {
  try {
    const { id } = getUser(req);
    const { clientUserId, content } = req.body;
    const conversation = await trainerService.startConversation(id, clientUserId, content);
    res.status(201).json(successResponse(conversation, 'Conversation started'));
  } catch {
    res.status(500).json(errorResponse('Failed to start conversation'));
  }
}

export async function getWorkoutProgressHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const { dateFrom, dateTo } = req.query as Record<string, string | undefined>;
    const progress = await trainerService.getWorkoutProgress(clientId, dateFrom, dateTo);
    res.json(successResponse(progress));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch workout progress';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getMeasurementProgressHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const measurements = await trainerService.getMeasurementProgress(clientId);
    res.json(successResponse(measurements));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch measurements';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getStrengthProgressHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const strength = await trainerService.getStrengthProgress(clientId);
    res.json(successResponse(strength));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch strength progress';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getNutritionAdherenceHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const adherence = await trainerService.getNutritionAdherence(clientId);
    res.json(successResponse(adherence));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch nutrition adherence';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getCompleteProgressSummaryHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const summary = await trainerService.getCompleteProgressSummary(clientId);
    res.json(successResponse(summary));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch progress summary';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getClientSummaryReportHandler(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId as string;
    const report = await trainerService.generateClientSummary(clientId);
    res.json(successResponse(report));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate report';
    res.status(error instanceof Error && 'statusCode' in error ? (error as Record<string, number>).statusCode : 500).json(errorResponse(message));
  }
}

export async function getMonthlyReportHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const { year, month } = req.query as Record<string, string | undefined>;
    const report = await trainerService.generateMonthlyReport(
      trainerId,
      year ? parseInt(year, 10) : undefined,
      month ? parseInt(month, 10) : undefined
    );
    res.json(successResponse(report));
  } catch {
    res.status(500).json(errorResponse('Failed to generate report'));
  }
}

export async function getEarningsReportHandler(req: Request, res: Response) {
  try {
    const { id: trainerId } = getTrainer(req);
    const report = await trainerService.generateEarningsReport(trainerId);
    res.json(successResponse(report));
  } catch {
    res.status(500).json(errorResponse('Failed to generate earnings report'));
  }
}

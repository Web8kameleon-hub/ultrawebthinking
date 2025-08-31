/**
 * AGI Mind Module - Real Decision Making
 * Makes decisions based on sense analysis
 * @author Ledjan Ahmati  
 * @version 8.0.0 Real
 */

import { type SenseResult } from './sense';

export interface MindResult {
  action: 'provide_info' | 'search_data' | 'navigate_to' | 'execute_command' | 'chat_response' | 'error_response';
  reasoning: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  parameters: Record<string, any>;
  confidence: number;
}

/**
 * Decide what action to take based on sense analysis
 */
export async function decideAction(sense: SenseResult): Promise<MindResult> {
  // Handle low confidence inputs
  if (sense.confidence < 0.3) {
    return {
      action: 'error_response',
      reasoning: 'Input unclear or insufficient information',
      priority: 'low',
      parameters: { 
        message: 'Ju lutem jepni më shumë informacion ose qartësoni kërkesën tuaj.'
      },
      confidence: 0.8
    };
  }

  // Decision logic based on intent
  switch (sense.intent) {
    case 'search':
      return handleSearchIntent(sense);
      
    case 'question':
      return handleQuestionIntent(sense);
      
    case 'navigate':
      return handleNavigateIntent(sense);
      
    case 'command':
      return handleCommandIntent(sense);
      
    case 'chat':
      return handleChatIntent(sense);
      
    default:
      return handleUnknownIntent(sense);
  }
}

function handleSearchIntent(sense: SenseResult): MindResult {
  return {
    action: 'search_data',
    reasoning: `User wants to search for: ${sense.keywords.join(', ')}`,
    priority: 'medium',
    parameters: {
      query: sense.keywords.join(' '),
      type: 'general_search',
      language: sense.language
    },
    confidence: sense.confidence
  };
}

function handleQuestionIntent(sense: SenseResult): MindResult {
  // Analyze question type
  const questionType = analyzeQuestionType(sense.keywords);
  
  return {
    action: 'provide_info',
    reasoning: `User asked a ${questionType} question`,
    priority: 'medium',
    parameters: {
      question_type: questionType,
      keywords: sense.keywords,
      language: sense.language
    },
    confidence: sense.confidence
  };
}

function handleNavigateIntent(sense: SenseResult): MindResult {
  return {
    action: 'navigate_to',
    reasoning: 'User wants navigation assistance',
    priority: 'high',
    parameters: {
      destination: sense.keywords.filter(k => !['go', 'navigate', 'navigo', 'shko'].includes(k)).join(' '),
      language: sense.language
    },
    confidence: sense.confidence
  };
}

function handleCommandIntent(sense: SenseResult): MindResult {
  const command = identifyCommand(sense.keywords);
  
  return {
    action: 'execute_command',
    reasoning: `User wants to execute: ${command}`,
    priority: command === 'delete' ? 'urgent' : 'high',
    parameters: {
      command,
      targets: sense.keywords,
      language: sense.language
    },
    confidence: sense.confidence
  };
}

function handleChatIntent(sense: SenseResult): MindResult {
  return {
    action: 'chat_response',
    reasoning: 'User wants conversational interaction',
    priority: 'medium',
    parameters: {
      topic: sense.keywords.slice(0, 3).join(' '), // Main topic from first few keywords
      sentiment: sense.sentiment,
      language: sense.language,
      entities: sense.entities
    },
    confidence: sense.confidence
  };
}

function handleUnknownIntent(sense: SenseResult): MindResult {
  return {
    action: 'chat_response',
    reasoning: 'Intent unclear, defaulting to conversational response',
    priority: 'low',
    parameters: {
      fallback: true,
      keywords: sense.keywords,
      language: sense.language
    },
    confidence: Math.max(sense.confidence - 0.2, 0.1)
  };
}

function analyzeQuestionType(keywords: string[]): string {
  if (keywords.some(k => ['what', 'çfarë'].includes(k))) return 'what';
  if (keywords.some(k => ['how', 'si'].includes(k))) return 'how';
  if (keywords.some(k => ['why', 'pse'].includes(k))) return 'why';
  if (keywords.some(k => ['when', 'kur'].includes(k))) return 'when';
  if (keywords.some(k => ['where', 'ku'].includes(k))) return 'where';
  if (keywords.some(k => ['who', 'kush'].includes(k))) return 'who';
  
  return 'general';
}

function identifyCommand(keywords: string[]): string {
  if (keywords.some(k => ['create', 'krijo', 'make'].includes(k))) return 'create';
  if (keywords.some(k => ['delete', 'fshij', 'remove'].includes(k))) return 'delete';
  if (keywords.some(k => ['update', 'përditëso', 'change'].includes(k))) return 'update';
  if (keywords.some(k => ['run', 'execute', 'ekzekuto', 'start'].includes(k))) return 'run';
  if (keywords.some(k => ['stop', 'ndalo', 'halt'].includes(k))) return 'stop';
  
  return 'general';
}

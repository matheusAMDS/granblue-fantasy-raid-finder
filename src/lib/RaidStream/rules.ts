import api from "./api"
import { RAID_STREAM_RULES } from "../../config"

interface Rule {
  value: string
  tag: string 
  id: string
}

interface RulesResponse {
  data: Rule[]
}

const rulesURL = '/tweets/search/stream/rules'

export async function initializeRules() {
  try {
    const rules = await getRules()

    await removeRules(rules)
    await setRules()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function setRules(): Promise<Rule[]> {
  const response = await api.post<RulesResponse>(rulesURL, RAID_STREAM_RULES)

  return response.data.data
}

async function getRules(): Promise<Rule[]> {
  const response = await api.get<RulesResponse>(rulesURL)

  return response.data.data
}

async function removeRules(rules: Rule[]): Promise<void> {
  if (Array.isArray(rules)) {
    const ids = rules.map(rule => rule.id)
    
    await api.post(rulesURL, {
      delete: {
        ids
      }
    })
  }
}
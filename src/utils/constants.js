export const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

export const TASK_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  PAUSED: 'Paused',
  COMPLETED: 'Completed',
}

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const TASK_RESOLUTION = {
  DONE: 'Done',
  WONT_FIX: "Won't Fix",
  DUPLICATE: 'Duplicate',
  CANNOT_REPRODUCE: 'Cannot Reproduce',
}

export const SPRINT_STATUS = {
  CREATED: 'Created',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
}

export const INVITATION_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
}

export const ORG_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
}

export const TASK_LINK_TYPE = {
  BLOCKS: 'blocks',
  BLOCKED_BY: 'blocked-by',
  RELATES_TO: 'relates-to',
  DUPLICATES: 'duplicates',
  DEPENDS_ON: 'depends-on',
}

export const WEBHOOK_EVENTS = [
  'task.created',
  'task.updated',
  'task.deleted',
  'comment.created',
]

export const NOTIFICATION_TYPE = {
  TASK_ASSIGNED: 'task_assigned',
  PROJECT_INVITE: 'project_invite',
  MANAGER_INVITE: 'manager_invite',
  COMMENT_ADDED: 'comment_added',
  SPRINT_COMPLETED: 'sprint_completed',
}

export const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'text/csv',
  'text/plain',
]

export const MAX_FILES_PER_UPLOAD = 10
export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

import { useCallback } from 'react'
import useProjectStore from '../stores/projectStore'
import useTaskStore from '../stores/taskStore'
import useSprintStore from '../stores/sprintStore'
import useBoardStore from '../stores/boardStore'
import useLabelStore from '../stores/labelStore'

const useProjectInit = () => {
  const { fetchProjectDetail, fetchProjectTeam } = useProjectStore()
  const { fetchProjectTasks } = useTaskStore()
  const { fetchSprints } = useSprintStore()
  const { fetchBoardConfigs } = useBoardStore()
  const { fetchLabels } = useLabelStore()

  const initProject = useCallback(async (projectId) => {
    await Promise.all([
      fetchProjectDetail(projectId),
      fetchProjectTasks(projectId),
      fetchSprints(projectId),
      fetchBoardConfigs(projectId),
      fetchLabels(projectId),
      fetchProjectTeam(projectId),
    ])
  }, [fetchProjectDetail, fetchProjectTeam, fetchProjectTasks, fetchSprints, fetchBoardConfigs, fetchLabels])

  return { initProject }
}

export default useProjectInit

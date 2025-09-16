
export async function getDropdownConfigs() {
    const response = await fetch('http://localhost:3002/api/v1/agent-onboarding/config/dropdowns');
    if (!response.ok) throw new Error('Failed to fetch dropdown configs');
    return response.json();
  }

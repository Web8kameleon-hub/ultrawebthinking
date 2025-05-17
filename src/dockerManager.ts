import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

/**
 * List all running containers.
 */
export async function listContainers(): Promise<void> {
  try {
    const containers = await docker.listContainers();
    console.log('Running Containers:');
    containers.forEach((container) => {
      console.log(`- ${container.Names[0]} (ID: ${container.Id})`);
    });
  } catch (error) {
    console.error('❌ Error listing containers:', error);
  }
}

/**
 * Start a container by name or ID.
 * @param containerName - The name or ID of the container to start.
 */
export async function startContainer(containerName: string): Promise<void> {
  try {
    const container = docker.getContainer(containerName);
    await container.start();
    console.log(`✅ Container "${containerName}" started successfully.`);
  } catch (error) {
    console.error(`❌ Error starting container "${containerName}":`, error);
  }
}

/**
 * Stop a container by name or ID.
 * @param containerName - The name or ID of the container to stop.
 */
export async function stopContainer(containerName: string): Promise<void> {
  try {
    const container = docker.getContainer(containerName);
    await container.stop();
    console.log(`✅ Container "${containerName}" stopped successfully.`);
  } catch (error) {
    console.error(`❌ Error stopping container "${containerName}":`, error);
  }
}

/**
 * Remove a container by name or ID.
 * @param containerName - The name or ID of the container to remove.
 */
export async function removeContainer(containerName: string): Promise<void> {
  try {
    const container = docker.getContainer(containerName);
    await container.remove();
    console.log(`✅ Container "${containerName}" removed successfully.`);
  } catch (error) {
    console.error(`❌ Error removing container "${containerName}":`, error);
  }
}

// Example usage
(async () => {
  console.log('🔍 Listing all containers...');
  await listContainers();

  // Example: Start a container
  // await startContainer('ultrawebthinking');

  // Example: Stop a container
  // await stopContainer('ultrawebthinking');

  // Example: Remove a container
  // await removeContainer('ultrawebthinking');
})();
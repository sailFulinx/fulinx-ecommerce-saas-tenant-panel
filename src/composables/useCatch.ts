type Fn<T> = () => T | Promise<T>

/**
 * promise try catch wrap function
 * @param {Fn<T>} fn - callback function
 * @returns {Promise<T>}
 */
const useCatch = async <T>(fn: Fn<T>): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    return Promise.reject(error)
  }
}

export { useCatch as $catch, useCatch }

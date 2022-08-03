export const linear = [[[0, 1], '', [0.33, 0.67]], [[1, 0], [0.67, 0.33]]]

/**
 * @description Sine
 */

export const easeInSine = [[[0, 1]], [[0.538, 0.564], [0.169, 0.912], [0.880, 0.196]], [[1, 0]]]

export const easeOutSine = [[[0, 1]], [[0.444, 0.448], [0.169, 0.736], [0.718, 0.16]], [[1, 0]]]

export const easeInOutSine = [[[0, 1]], [[0.5, 0.5], [0.2, 1], [0.8, 0]], [[1, 0]]]

/**
 * @description Quad
 */

export const easeInQuad = [[[0, 1]], [[0.550, 0.584], [0.231, 0.904], [0.868, 0.264]], [[1, 0]]]

export const easeOutQuad = [[[0, 1]], [[0.413, 0.428], [0.065, 0.816], [0.760, 0.04]], [[1, 0]]]

export const easeInOutQuad = [[[0, 1]], [[0.5, 0.5], [0.3, 0.9], [0.7, 0.1]], [[1, 0]]]

/**
 * @description Cubic
 */

export const easeInCubic = [[[0, 1]], [[0.679, 0.688], [0.366, 0.992], [0.992, 0.384]], [[1, 0]]]

export const easeOutCubic = [[[0, 1]], [[0.321, 0.312], [0.008, 0.616], [0.634, 0.008]], [[1, 0]]]

export const easeInOutCubic = [[[0, 1]], [[0.5, 0.5], [0.3, 1], [0.7, 0]], [[1, 0]]]

/**
 * @description Quart
 */

export const easeInQuart = [[[0, 1]], [[0.812, 0.74], [0.611, 0.988], [1.013, 0.492]], [[1, 0]]]

export const easeOutQuart = [[[0, 1]], [[0.152, 0.244], [0.001, 0.448], [0.285, -0.02]], [[1, 0]]]

export const easeInOutQuart = [[[0, 1]], [[0.5, 0.5], [0.4, 1], [0.6, 0]], [[1, 0]]]

/**
 * @description Quint
 */

export const easeInQuint = [[[0, 1]], [[0.857, 0.856], [0.714, 1], [1, 0.712]], [[1, 0]]]

export const easeOutQuint = [[[0, 1]], [[0.108, 0.2], [0.001, 0.4], [0.214, -0.012]], [[1, 0]]]

export const easeInOutQuint = [[[0, 1]], [[0.5, 0.5], [0.5, 1], [0.5, 0]], [[1, 0]]]

/**
 * @description Back
 */

export const easeInBack = [[[0, 1]], [[0.667, 0.896], [0.380, 1.184], [0.955, 0.616]], [[1, 0]]]

export const easeOutBack = [[[0, 1]], [[0.335, 0.028], [0.061, 0.22], [0.631, -0.18]], [[1, 0]]]

export const easeInOutBack = [[[0, 1]], [[0.5, 0.5], [0.4, 1.4], [0.6, -0.4]], [[1, 0]]]

/**
 * @description Elastic
 */

export const easeInElastic = [[[0, 1]], [[0.474, 0.964], [0.382, 0.988], [0.557, 0.952]], [[0.619, 1.076], [0.565, 1.088], [0.669, 1.08]], [[0.770, 0.916], [0.712, 0.924], [0.847, 0.904]], [[0.911, 1.304], [0.872, 1.316], [0.961, 1.34]], [[1, 0]]]

export const easeOutElastic = [[[0, 1]], [[0.073, -0.32], [0.034, -0.328], [0.104, -0.344]], [[0.191, 0.092], [0.110, 0.06], [0.256, 0.08]], [[0.310, -0.076], [0.260, -0.068], [0.357, -0.076]], [[0.432, 0.032], [0.362, 0.028], [0.683, -0.004]], [[1, 0]]]

export const easeInOutElastic = [[[0, 1]], [[0.210, 0.94], [0.167, 0.884], [0.252, 0.98]], [[0.299, 1.104], [0.256, 1.092], [0.347, 1.108]], [[0.5, 0.496], [0.451, 0.672], [0.548, 0.324]], [[0.696, -0.108], [0.652, -0.112], [0.741, -0.124]], [[0.805, 0.064], [0.756, 0.012], [0.866, 0.096]], [[1, 0]]]

/**
 * @description Bounce
 */

export const easeInBounce = [[[0, 1]], [[0.148, 1], [0.075, 0.868], [0.193, 0.848]], [[0.326, 1], [0.276, 0.836], [0.405, 0.712]], [[0.600, 1], [0.511, 0.708], [0.671, 0.348]], [[1, 0]]]

export const easeOutBounce = [[[0, 1]], [[0.357, 0.004], [0.270, 0.592], [0.376, 0.252]], [[0.604, -0.004], [0.548, 0.312], [0.669, 0.184]], [[0.820, 0], [0.749, 0.184], [0.905, 0.132]], [[1, 0]]]

export const easeInOutBounce = [[[0, 1]], [[0.102, 1], [0.050, 0.864], [0.117, 0.86]], [[0.216, 0.996], [0.208, 0.844], [0.227, 0.808]], [[0.347, 0.996], [0.343, 0.8], [0.480, 0.292]], [[0.635, 0.004], [0.511, 0.676], [0.656, 0.208]], [[0.787, 0], [0.760, 0.2], [0.795, 0.144]], [[0.905, -0.004], [0.899, 0.164], [0.944, 0.144]], [[1, 0]]]

export default new Map([
  ['linear', linear],
  ['easeInSine', easeInSine],
  ['easeOutSine', easeOutSine],
  ['easeInOutSine', easeInOutSine],
  ['easeInQuad', easeInQuad],
  ['easeOutQuad', easeOutQuad],
  ['easeInOutQuad', easeInOutQuad],
  ['easeInCubic', easeInCubic],
  ['easeOutCubic', easeOutCubic],
  ['easeInOutCubic', easeInOutCubic],
  ['easeInQuart', easeInQuart],
  ['easeOutQuart', easeOutQuart],
  ['easeInOutQuart', easeInOutQuart],
  ['easeInQuint', easeInQuint],
  ['easeOutQuint', easeOutQuint],
  ['easeInOutQuint', easeInOutQuint],
  ['easeInBack', easeInBack],
  ['easeOutBack', easeOutBack],
  ['easeInOutBack', easeInOutBack],
  ['easeInElastic', easeInElastic],
  ['easeOutElastic', easeOutElastic],
  ['easeInOutElastic', easeInOutElastic],
  ['easeInBounce', easeInBounce],
  ['easeOutBounce', easeOutBounce],
  ['easeInOutBounce', easeInOutBounce]
])

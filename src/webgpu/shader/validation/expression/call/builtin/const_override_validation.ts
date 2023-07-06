import { assert, unreachable } from '../../../../../../common/util/util.js';
import {
  Type,
  TypeF16,
  VectorType,
  elementType,
  isAbstractType,
} from '../../../../../util/conversion.js';
import { fullF16Range, fullF32Range, fullF64Range, linearRange } from '../../../../../util/math.js';
import { ShaderValidationTest } from '../../../shader_validation_test.js';

/// A linear sweep between -2 to 2
export const kMinusTwoToTwo = linearRange(-2, 2, 10);

/// An array of values ranging from -3π to 3π, with a focus on multiples of π
export const kMinus3PiTo3Pi = [
  -3 * Math.PI,
  -2.999 * Math.PI,

  -2.501 * Math.PI,
  -2.5 * Math.PI,
  -2.499 * Math.PI,

  -2.001 * Math.PI,
  -2.0 * Math.PI,
  -1.999 * Math.PI,

  -1.501 * Math.PI,
  -1.5 * Math.PI,
  -1.499 * Math.PI,

  -1.001 * Math.PI,
  -1.0 * Math.PI,
  -0.999 * Math.PI,

  -0.501 * Math.PI,
  -0.5 * Math.PI,
  -0.499 * Math.PI,

  -0.001,
  0,
  0.001,

  0.499 * Math.PI,
  0.5 * Math.PI,
  0.501 * Math.PI,

  0.999 * Math.PI,
  1.0 * Math.PI,
  1.001 * Math.PI,

  1.499 * Math.PI,
  1.5 * Math.PI,
  1.501 * Math.PI,

  1.999 * Math.PI,
  2.0 * Math.PI,
  2.001 * Math.PI,

  2.499 * Math.PI,
  2.5 * Math.PI,
  2.501 * Math.PI,

  2.999 * Math.PI,
  3 * Math.PI,
] as const;

/// The evaluation stages to test
export const kConstantAndOverrideStages = ['constant', 'override'] as const;

export type ConstantOrOverrideStage = 'constant' | 'override';

/**
 * @returns true if evaluation stage @p stage supports expressions of type @p.
 */
export function stageSupportsType(stage: ConstantOrOverrideStage, type: Type) {
  if (stage === 'override' && isAbstractType(elementType(type)!)) {
    // Abstract numerics are concretized before being used in an override expression.
    return false;
  }
  return true;
}

/**
 * Runs a validation test to check that evaluation of @p builtin either evaluates with or without
 * error at shader creation time or pipeline creation time.
 * @param t the ShaderValidationTest
 * @param builtin the name of the builtin
 * @param expectedResult false if an error is expected, true if no error is expected
 * @param value the value to pass to the builtin
 * @param type the type to convert @p value to before passing to the builtin
 * @param stage the evaluation stage
 */
export function validateConstOrOverrideBuiltinEval(
  t: ShaderValidationTest,
  builtin: string,
  expectedResult: boolean,
  value: number,
  type: Type,
  stage: ConstantOrOverrideStage
) {
  const elTy = elementType(type)!;
  const enables = elTy === TypeF16 ? 'enable f16;' : '';
  let conversion = '';
  if (isAbstractType(elTy)) {
    if (type instanceof VectorType) {
      conversion = `vec${type.width}`;
    }
  } else {
    conversion = type.toString();
  }

  switch (stage) {
    case 'constant': {
      let val_str = value.toString();
      if (!val_str.includes('.') && !val_str.includes('e')) {
        val_str += '.0';
      }

      t.expectCompileResult(
        expectedResult,
        `${enables}
const v = ${builtin}(${conversion}(${val_str}));`
      );
      break;
    }
    case 'override': {
      assert(!isAbstractType(elTy));
      t.expectPipelineResult({
        expectedResult,
        code: `${enables}
override o : ${elTy.toString()};
var<private> v = ${builtin}(${conversion}(o));`,
        constants: { o: value },
        reference: ['v'],
      });
      break;
    }
  }
}

/** @returns a sweep of the representable values for element type of @p type */
export function fullFPRangeForType(type: Type) {
  switch (elementType(type)?.kind) {
    case 'abstract-float':
      return fullF64Range();
    case 'f32':
      return fullF32Range();
    case 'f16':
      return fullF16Range();
  }
  unreachable();
}

/** @returns all the values in the provided arrays with duplicates removed */
export function unique<T>(...arrays: Array<readonly T[]>): T[] {
  const set = new Set<T>();
  for (const arr of arrays) {
    for (const item of arr) {
      set.add(item);
    }
  }
  return [...set];
}
# Auto generated test plans

An `auto-generated test plan` is a [test plan](./intro/plans.md) with a `unique-id` that is generated by parsing the [WGSL specification](https://www.w3.org/TR/WGSL/) using this [tool](https://dawn.googlesource.com/tint/+/refs/heads/main/tools/src/cmd/get-test-plan/main.go). A typical auto-generated WGSL test plan:

```
g.test(<name>)
  .uniqueId(<unique-id>)
  .specURL(<url>)
  .desc(<description>)
  .params(u => u.combine('placeHolder1', ['placeHolder2', 'placeHolder3']))
  .unimplemented();
```

- `name`: An arbitrary name.
- `url`: The URL of the section this test plan is extracted from, ie. `https://www.w3.org/TR/<version>/#<section-name>`.`section-name` is the section of the WGSL specification this test plan is generated from.
- `description`: The portion of WGSL specification this test plan is generated from.
- `unique-id`: A token used for tracking and updating the auto generated test plans.
```
unique-id = sha1(<section-name> + <description>)
```

# How to contribute

To implement an auto-generated test plan:
1. Choose an auto-generated test plan that is not currently under development, ie. looking up the `unique-id` in [this list](https://bugs.chromium.org/p/tint/issues/list) must not return any results.
2. [Submit](https://chromium.googlesource.com/infra/infra/+/HEAD/appengine/monorail/doc/userguide/working-with-issues.md#How-to-enter-an-issue) a new issue using this [template](https://bugs.chromium.org/p/tint/issues/entry?template=WGSL+CTS+with+a+unique+id). Make sure to include the `unique-id` and `url`.
3. Implement the test plan. You may modify the test name and description; however, `url` and `unique-id` must remain unchanged.
4. Add a [comment](https://chromium.googlesource.com/infra/infra/+/HEAD/appengine/monorail/doc/userguide/working-with-issues.md#How-to-comment-on-an-issue) to the issue (created in step 2) with a link to your merged pull request. Then close the issue with status `Fixed`.

# Useful helpers

Take advantage of the [helpers](./helper_index.txt), specially:
- [Helpers for WGSL data types](../src/webgpu/shader/types.ts).
- [Helpers for WGSL builtin function execution tests](../src/webgpu/shader/execution/builtin/builtin.ts).
- [Base fixture for WebGPU validation tests](../src/webgpu/shader/validation/shader_validation_test.ts).

# Example

- Builtin-function execution test example: [abs.spec.ts](../src/webgpu/shader/execution/builtin/abs.spec.ts).
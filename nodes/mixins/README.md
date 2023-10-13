# Mixin

The DOM nodes mixin and partial mixin interface implementation

## Coding Style

The implementation of mixin is based on the following assumptions:

- No inheritance of prototypes
- Use stage 2 decorators

Styles that satisfy these assumptions are defined in classes, and the strategy
is to extend prototypes.

Inheritance of prototypes is not allowed as it does not pass rigorous testing.

Also, the decorator proposal is currently
[state 3](https://github.com/tc39/proposal-decorators?tab=readme-ov-file), but
[v8](https://github.com/v8/v8) does not support it, so use state 2 decorators.

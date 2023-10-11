# utils

Algorithms related to Node that may cause circular

All modules can cause circular imports. Therefore, if a module is used, it must
be imported directly by the WebIDL implementation or used only within this
module.

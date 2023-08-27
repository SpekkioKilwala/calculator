# calculator
The Odin Project: Calculator

It works. It's not quite as smooth as a real calculator (it
lacks some convenience functions like repeated operations
and is a little strange in displaying long numbers *around*
the decimal point) but it seems functional and stable.

Development-wise, the state of things is:
I don't want to implement anything more ambitious (e.g. Undo)
until I've got better control over all the variables that
constitute state: both operands, the returned value from the
last operation, the operator, and the operator in the last
operation. Which ARE all different and independent!

I want clearer display of all of those state variables and
their implications e.g. which one *will* be affected on a
keypress and which ones will be used if an operation is
attempted.
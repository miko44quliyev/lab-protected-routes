# Design log

We grade the *thinking*, not the length. Short, honest answers beat padding.
Write these as you build, not at the end.

---

## 1. The role check: which option did you pick?

In step 4 you chose between checking the role inside the admin page (Option A) or
teaching `ProtectedRoute` a `requiredRole` prop (Option B). Which one did you
pick, and why? What would make you switch to the other one?

_your answer_

## 2. The flash problem

There is a moment when the page first loads where the user *looks* logged out
even though they have a valid session cookie. Where does that moment come from, and what
in your `ProtectedRoute` prevents the user from seeing the wrong thing during it?
(Mention both the spinner and the `return null`.)

_your answer_

## 3. Gating the delete button

How did you decide whether to show the delete button? Where does that decision
live, and what does a normal `USER` actually see in the markup?

_your answer_

## 4. The navbar in each state

Describe what the navbar renders in each of these cases: logged out, logged in as
a `USER`, logged in as an `ADMIN`. What single value drives the difference?

_your answer_

## 5. If I had another hour

What would you add or clean up next? (Redirect after login, active link
highlighting, real delete against a backend, nicer access-denied page...)

_your answer_

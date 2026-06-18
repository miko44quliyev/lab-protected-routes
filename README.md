# Lab: Who gets to see the back office?

<img src="./public/main.png" width=600 />

## Introduction

Yesterday you built a working login. Email, password, an httpOnly cookie doing
its job, a shiny `useAuth()` hook that asks the backend "who am I?" instead of
reading a token itself. Great. Then your teammate opened the app, typed `/admin`
straight into the URL bar while logged out, and saw the entire admin panel.
Danger Zone button included. 🙀

That is the problem this lab is about, and it teaches one skill you will reach
for on basically every real app you ever build: **protected routes and an
auth-aware UI**. Deciding who is allowed to see a page, sending the rest to the
login screen, and showing each person only the buttons they are allowed to press.

The auth layer (the context, the login form, the calls to your backend) is
already wired up for you in this starter. Your job is everything that happens
*after* someone is logged in: locking the doors and handing out the right keys.

## The situation

> Hey, welcome to PostHub. So we have a posts feed for the team and an admin
> panel for, well, admins. Two problems. One, right now a complete stranger who
> is not logged in can read both pages just by guessing the URL. That needs to
> stop. Two, the navbar always shows a "Login" button, even for people who are
> already logged in, which looks broken. Oh, and one more thing: admins need to
> be able to delete posts, but a normal user should not even *see* a delete
> button. Same page, different buttons depending on who is looking.

That last sentence is the heart of this lab. The same page renders different
things depending on the user's role. Keep it in mind the whole way through.

## The backend you already have

This lab does not ship its own backend. You use the **Spring Boot `simple_auth`
backend you built in the previous lesson**. Start it up so it is listening on
`http://localhost:8080`.

This is **cookie based auth**, exactly like yesterday. The token lives in an
httpOnly cookie that the browser sends automatically. Your JavaScript never reads
it. You prove who you are by asking the backend, not by holding a token.

The frontend expects these endpoints (all under `/api`):

- `POST /api/login` with `{ email, password }`, sets the httpOnly auth cookie
- `POST /api/signup` to create a user
- `GET /api/me`, reads the cookie and returns the current user as
  `{ id, name, email, role }`
- `POST /api/logout`, clears the cookie (only the backend can clear an httpOnly
  cookie, JavaScript cannot)

Three things to check before you write any frontend code:

1. **`/api/me` must include the `role`.** Role based access only works if the
   backend tells the frontend which role the user has. Hit the endpoint while
   logged in and confirm `role` is in the response.
2. **Cookies must flow.** Every request from the frontend already sends
   `credentials: "include"` (see `lib/api.js`). For the browser to accept and
   resend the cookie, the backend's CORS config must allow credentials and name
   a specific origin (`http://localhost:3000`), not `*`. This is the same setup
   that made yesterday's login work, so keep the backend running the same way.
3. **`/logout`.** If your backend does not have a logout route yet, add one that
   clears the cookie. Without it, JavaScript cannot log the user out.

> If your `/me` returns a slightly different shape, open `context/AuthContext.js`
> and `lib/api.js` and adjust. They are short and commented on purpose.

### Seed users with different roles

Your seeder currently creates one demo user with the `USER` role. To test
role based access you need at least one `ADMIN`. Open `DataSeeder.java` in the
backend (package `com.ironhack.simple_auth.config`) and add a second user next
to the demo one:

```java
if (!userRepository.existsByEmail("admin@ironhack.com")) {
    User admin = new User();
    admin.setName("Ada Admin");
    admin.setEmail("admin@ironhack.com");
    admin.setPassword(passwordEncoder.encode("password"));
    admin.setRole("ADMIN");
    userRepository.save(admin);
    System.out.println(">> Seeded admin user: admin@ironhack.com / password");
}
```

Restart the backend so the seeder runs. Now you have:

- `demo@ironhack.com` / `password` with role `USER`
- `admin@ironhack.com` / `password` with role `ADMIN`

⚠️ The role string must match exactly what your frontend checks for. This lab
checks for the literal string `"ADMIN"`. If your seeder saves `"admin"` or
`"ROLE_ADMIN"`, your admin will be treated as a normal user. Pick one spelling
and be consistent.

## The posts API

The posts themselves come from a free fake API, **jsonplaceholder**:

```
https://jsonplaceholder.typicode.com/posts
```

Open that URL in your browser before you start so you know the shape of the data
(an array of objects with `id`, `title`, `body`, `userId`). The fetching is
already done for you in `app/posts/page.js`.

⚠️ jsonplaceholder *pretends* to delete. A `DELETE` request returns a success
response but nothing is actually removed on their server. So when you build the
delete button, just remove the post from your local state. That is enough.

## What is already wired vs. what you build

| Already done for you                          | Your job in this lab                          |
| --------------------------------------------- | --------------------------------------------- |
| `context/AuthContext.js` (`useAuth`, cookie)  | A reusable `ProtectedRoute` component         |
| `components/LoginForm.js` + `/login` page     | Protecting `/posts` and `/admin`              |
| `lib/api.js` (sends the cookie on every call) | Role gate so only `ADMIN` sees `/admin`       |
| `app/posts/page.js` fetching from the API     | Making the navbar adapt to the auth state     |
| A cohesive design to match                    | An admin-only delete button on each post      |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Make sure your Spring Boot backend is also running
on `:8080`.

Here is the **broken starting state**, and it is broken on purpose:

- You can open `/posts` and `/admin` without logging in. Try it. Everything is
  visible, including the Danger Zone.
- The navbar shows a "Login" button at all times, even after you log in.
- There is no delete button anywhere.

If you see all of that, the starter is working as intended. Now go fix it.

## Your job

Build in this order. Get the smallest thing working before moving on.

### 1. Build a `ProtectedRoute` component

Create `components/ProtectedRoute.js`. It is a wrapper: it reads `loading` and
`isAuthenticated` from `useAuth()`, and:

- while `loading` is true, shows a spinner (the auth provider is still asking the
  backend "who am I?"),
- once loading is done, if the user is not authenticated, sends them to
  `/login`,
- renders its `children` only when the user really is allowed in.

The morning lesson walks through every line of this, including *why* you wait for
`loading` and *why* you return `null` during the redirect. Do not skip those two
questions, they are the whole point.

### 2. Protect the posts page

Wrap the content of `app/posts/page.js` in your `<ProtectedRoute>`. Log out and
try to visit `/posts`. You should land on `/login` instead.

### 3. Make the navbar adapt

`components/NavBar.js` currently shows the same links for everyone. Make it react
to the auth state:

- logged out: show the "Login" button,
- logged in: show the user's name, their role, and a "Sign Out" button that
  calls `logout()`.

### 4. Protect AND role-gate the admin page

`/admin` needs two locks. First, the same protection as posts (must be logged
in). Second, a **role check**: only a user whose `role` is `"ADMIN"` sees the
panel. Everyone else (logged in or not) should get a clear "Access Denied"
message instead of the back office content.

### 5. Add an admin-only delete button

On each post card in `app/posts/page.js`, show a delete button **only when the
logged in user is an admin**. A normal user should not see it at all. Clicking it
removes that post from the list.

## The decision point

For the admin role check in step 4, you have two reasonable options. Pick one on
purpose and be ready to explain why in your `NOTES.md`.

**Option A: check the role inside the page.** Wrap `/admin` in your normal
`ProtectedRoute`, then inside the page do `user.role === "ADMIN" ? <Panel /> :
<AccessDenied />`. Simple, the logic lives right where you use it.

**Option B: teach `ProtectedRoute` about roles.** Give it a `requiredRole` prop,
e.g. `<ProtectedRoute requiredRole="ADMIN">`. Now every protected-and-role-gated
page is one line, and the rule lives in one place. More reusable, slightly more
abstract.

Neither is "correct". The question is what you would want if the app grew to ten
admin pages. 💡

## How to work through this

1. Re-read the morning lesson, especially the `ProtectedRoute` walkthrough and
   the loading-state table. The answers are in there.
2. Build `ProtectedRoute` and protect *one* page first. Confirm the redirect
   works before touching anything else.
3. Then the navbar, then the role gate, then the delete button.
4. Test as both users. Log in as `demo`, confirm no delete button and no admin
   panel. Log in as `admin`, confirm both appear.

## Styling

Use Tailwind. The starter already has a consistent look (slate background,
indigo accent, rounded white cards). Match it so your new bits do not look bolted
on. The `Access Denied` screen and the delete button should feel like they belong.

## Checklist before you call it done

✅ A logged-out user who visits `/posts` is redirected to `/login`.

✅ A logged-out user who visits `/admin` is redirected to `/login`.

✅ A logged-in `USER` who visits `/admin` sees "Access Denied", not the panel.

✅ A logged-in `ADMIN` sees the full admin panel.

✅ The navbar shows the user's name and a Sign Out button when logged in.

✅ The navbar shows a Login button when logged out.

✅ The delete button appears only for admins and removes the post when clicked.

✅ There is no flash of protected content before a redirect happens.

✅ No errors in the browser console.

## If you finish early

- **Redirect after login.** When a logged-out user is bounced from `/admin`,
send them back to `/admin` after they log in, not to the posts page. Pass the
intended path as `/login?redirect=/admin` from `ProtectedRoute` and read it with
`useSearchParams()` on the login page.

- Highlight the active link in the navbar with `usePathname()`.

- Add a tiny "Signing out..." or skeleton state so transitions feel smooth.

## Key concepts to review

- [Next.js `useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [Next.js `useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [React `useEffect`](https://react.dev/reference/react/useEffect)
- [React Context](https://react.dev/reference/react/useContext)

## Delivering the lab

Everyone opens a pull request and shares the link in
the students portal. Fill in `NOTES.md`, we grade the thinking, not the word count.

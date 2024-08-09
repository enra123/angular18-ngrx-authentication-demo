import { test, expect } from '@playwright/test';

test('Redirect unauthenticated user to home', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL('/');
});

test('Redirect unauthenticated user to login', async ({ page }) => {
  await page.goto('/');
  await page.getByText('menu').click();
  await page.getByText('Dashboard', { exact: true }).click();

  await expect(page).toHaveURL('/login');
});

test('Display error message for empty email and password', async ({ page }) => {
  await page.goto('/register');
  await page.getByTestId('register-btn').click();
  await page.waitForLoadState();

  await expect(
    page.getByText('Email is required')
  ).toBeVisible();
  await expect(
    page.getByText('Password is required')
  ).toBeVisible();
});

test('Display error message for invalid email', async ({ page }) => {
  await page.goto('/register');
  await page.getByPlaceholder('Email').fill('invalid@email');
  await page.getByPlaceholder('Password', { exact: true }).fill('12345678');
  await page.getByTestId('register-btn').click();
  await page.waitForLoadState();

  await expect(
    page.getByText('Enter a valid email address')
  ).toBeVisible();
});

test('Display error message for invalid password', async ({ page }) => {
  await page.goto('/register');
  await page.getByPlaceholder('Email').fill('valid@email.com');
  await page.getByPlaceholder('Password', { exact: true }).fill('123456');
  await page.getByTestId('register-btn').click();
  await page.waitForLoadState();

  await expect(
    page.getByText('The minimum length for password is 8 characters')
  ).toBeVisible();
});

test('Display error message for duplicate email', async ({ page }) => {
  await page.goto('/register');
  await page.getByPlaceholder('Email').fill('valid@email.com');
  await page.getByPlaceholder('Password', { exact: true }).fill('12345678');
  await page.getByTestId('register-btn').click();
  await page.waitForLoadState();

  await expect(
    page.getByText('Email exists')
  ).toBeVisible();
});

test('Redirect successfully registered user to dashboard', async ({ page }) => {
  await page.goto('/register');
  const email: string = Date.now() + '@email.com';
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill('12345678');
  await page.getByTestId('register-btn').click();
  await page.waitForLoadState();

  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByRole('button', { name: email })
  ).toBeVisible();
  await page.screenshot({ path: 'e2etest.png' });
});

test('User login non-existing email', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('notexist@email.com');
  await page.getByPlaceholder('Password', { exact: true }).fill('12345678');
  await page.getByTestId('login-btn').click();
  await page.waitForLoadState();

  await expect(
    page.getByText(' Invalid email or password')
  ).toBeVisible();
});

test('User login wrong password', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('valid@email.com');
  await page.getByPlaceholder('Password', { exact: true }).fill('87654321');
  await page.getByTestId('login-btn').click();
  await page.waitForLoadState();

  await expect(
    page.getByText(' Invalid email or password')
  ).toBeVisible();
});

test('User login and logout', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('valid@email.com');
  await page.getByPlaceholder('Password', { exact: true }).fill('12345678');
  await page.getByTestId('login-btn').click();
  await page.waitForLoadState();

  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByRole('button', { name: 'valid@email.com' })
  ).toBeVisible();
  //await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForLoadState();

  await expect(page).toHaveURL('/');
  await expect(
    page.getByRole('button', { name: 'Login' })
  ).toBeVisible();
});



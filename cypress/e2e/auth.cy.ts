describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should redirect to dashboard after successful login', () => {
    // Intercept the login API call
    cy.intercept('POST', '/api/auth/callback/credentials', {
      statusCode: 200,
      body: {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'student'
        }
      }
    }).as('loginRequest');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
  });

  it('should navigate to registration page', () => {
    cy.contains('Create an account').click();
    cy.url().should('include', '/register');
  });
}); 
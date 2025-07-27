beforeEach(() => {
    cy.session('login-session', () => {
        cy.login();
    });
});

describe('User Account Menu', () => {
    it('Cek Sub Menu User Account', () => {
        cy.visit('/demo_psp2/merchant/dashboard');

        cy.contains('.c-sidebar-nav-dropdown-toggle', 'User Account')
        .should('be.visible')
        .click();

        cy.get('li.c-sidebar-nav-dropdown.c-show > ul.c-sidebar-nav-dropdown-items')
        .should('be.visible')
        .within(() => {
            cy.contains('a.c-sidebar-nav-link', 'Change Password').should('be.visible');
            cy.contains('a.c-sidebar-nav-link', 'Role Permission').should('be.visible');
            cy.contains('a.c-sidebar-nav-link', 'Sub Account').should('be.visible');
        });
    });
});

describe('Change Password Menu', () => {
    it('Masuk ke Sub Menu Change Password dan Check Existing Field', () => {
        cy.visit('/demo_psp2/merchant/dashboard');
        cy.contains('.c-sidebar-nav-dropdown-toggle', 'User Account')
        .should('be.visible')
        .click();

        cy.contains('a.c-sidebar-nav-link', 'Change Password')
        .should('be.visible')
        .click();

        cy.get('div.col-md-6').first().within(() => {
            cy.get('.card').within(() => {
                cy.contains('.card-header', 'Change Password').should('be.visible');

                cy.get('input[name="current_password"]').should('be.visible');
                cy.get('input[name="new_password"]').should('be.visible');
                cy.get('input[name="re_password"]').should('be.visible');

                cy.get('.card-footer button[type="submit"]')
                .should('be.visible')
                .and('contain.text', 'Save');
            });
        });

        cy.get('div.col-md-6').eq(1).within(() => {
            cy.get('form[action*="/submit2fa"]').within(() => {
                cy.contains('.card-header', '2FA QR-code').should('be.visible');

                cy.get('input[type="checkbox"][id="input-2fa"]').then(($checkbox) => {
                    if ($checkbox.length && $checkbox.is(':visible')) {
                        cy.log('2FA Tidak Aktif');
                        cy.wrap($checkbox)
                        .should('be.visible')
                        .and('not.be.checked');
                    } else {
                        cy.log('2FA Aktif');
                        cy.wait(1000);
                        cy.contains('#qr_description', '2FA already activated').should('be.visible');
                        cy.get('#qr_code_active > img').should('be.visible');
                        
                        cy.get('#secret').should('be.visible').invoke('text').then((text) => {
                            console.log('Secret Code: ', text);
                        });

                        cy.get('#qrdownload').should('exist');
                        cy.get('#copyGenerateSecret').should('exist');
                        cy.get('#deactive_2fa').should('exist');
                    }
                });
            });
        });
    });
});

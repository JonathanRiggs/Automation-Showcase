import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface ContactMessage {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    attachmentPath?: string;
}

export class ContactPage extends BasePage {
    protected readonly path = '/contact';

    readonly pageLoadedMarker: Locator;

    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly subject: Locator;
    readonly message: Locator;
    readonly attachment: Locator;
    readonly submit: Locator;

    constructor(page: Page) {
        super(page);

        this.firstName = page.getByTestId('first-name')
        this.lastName = page.getByTestId('last-name')
        this.email = page.getByTestId('email')
        this.subject = page.getByTestId('subject')
        this.message = page.getByTestId('message')
        this.attachment = page.getByTestId('attachment')
        this.submit = page.getByTestId('contact-submit')

        this.pageLoadedMarker = this.submit;
    }

    fieldError(field: string): Locator {
        return this.page.getByTestId(`${field}-error`)
    }

    async send(data: ContactMessage): Promise<void> {
        await this.firstName.fill(data.firstName)
        await this.lastName.fill(data.lastName)
        await this.email.fill(data.email)
        await this.subject.selectOption(data.subject)
        await this.message.fill(data.message)
        if (data.attachmentPath) {
            await this.attachment.setInputFiles(data.attachmentPath)
        }
        await this.submit.click()
    }

}
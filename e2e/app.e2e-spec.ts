import { JobstartPage } from './app.po';

describe('jobstart App', () => {
  let page: JobstartPage;

  beforeEach(() => {
    page = new JobstartPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

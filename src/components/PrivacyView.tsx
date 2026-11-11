import React from 'react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="z-10 flex w-full flex-1 flex-col items-center px-6 py-10 sm:py-12">
      <div className="w-full max-w-3xl space-y-8 sm:space-y-10">
        <div className="space-y-3 text-center">
          <h2 className="font-amsham text-5xl font-normal tracking-wide text-white sm:text-7xl">
            privacy
          </h2>
          <p className="text-xs font-light tracking-reduced text-neutral-400 sm:text-sm">
            your words are personal. here is how they are handled.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-7 text-sm font-light leading-relaxed tracking-reduced text-neutral-300 sm:text-base">
          <p className="text-xs text-neutral-500">Last updated: November 10, 2026</p>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white sm:text-lg">What you share</h3>
            <p>
              When you submit a message, the app receives the recipient name and message text you enter.
              You do not need to create an account or provide a sender profile. Please avoid including
              sensitive personal information about yourself or anyone else.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white sm:text-lg">How messages are used</h3>
            <p>
              Submissions are stored by the service and may be reviewed by its moderators. A message
              awaiting review is not shown in public search. If approved, its recipient name and text
              are displayed on the site and can be found through search. Do not submit anything you
              would not want publicly displayed.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white sm:text-lg">Storage and service providers</h3>
            <p>
              Messages are kept in the service database; the app does not describe an automatic
              deletion schedule. The site also loads fonts from Google Fonts, which means your
              browser requests font files from Google. The website host and API provider may process
              technical request data according to their own configuration and policies.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-medium text-white sm:text-lg">Your choices</h3>
            <p>
              You can choose not to submit a message. There is no self-service message deletion
              feature in the app. For privacy questions or a removal request, contact the site
              operator through the contact method provided with this site.
            </p>
          </section>
        </div>

        <div className="mx-auto h-px w-16 bg-neutral-800" />
      </div>
    </div>
  );
};

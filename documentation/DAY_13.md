# Day 13 - 31/05/26

## Work Done Today

* Continued working on the Karthificial project documentation and daily progress record.
* Updated the project progress notes to better match the actual work completed today.
* Reviewed the GitHub repository presentation and checked how the project appears publicly.
* Worked on improving the GitHub profile and repository introduction content.
* Prepared a short professional profile introduction suitable for public developer/profile use.
* Discussed suitable profile theme colors based on the preferred red, black, and white style.
* Checked the GPRM/profile input issue where the entered value was showing as invalid.
* Improved documentation wording so it sounds cleaner, more natural, and progress-based.
* Continued project cleanup, presentation improvement, and documentation refinement.
* Planned a reusable admin-controlled delete history option for MCQ performance analytics.
* Added the concept of a reusable confirmation modal for analytics deletion actions.
* Confirmed that admin must type `DELETE` before analytics history is removed.
* Clarified that deleting analytics history should only remove MCQ performance records, not MCQ sets, questions, or student accounts.
* Continued improving the contact page and navbar behavior.
* Restored the Contact page after previously hiding or disabling it.
* Built a responsive contact page approach where desktop uses the contact wheel layout and mobile/tablet uses a simpler card-based layout.
* Fixed mobile hamburger dropdown behavior so Notes and Question Papers can show both 10th and 12th options properly.
* Added support for dropdown tap behavior inside the mobile hamburger menu.
* Fixed missing Contact link behavior in the mobile hamburger menu.
* Fixed admin navbar behavior so Contact does not appear unnecessarily in the admin page.
* Added View Site access inside the admin hamburger menu while keeping the desktop View Site button unchanged.
* Improved admin navbar behavior and styling so admin pages use a separate admin-style navbar instead of inheriting the normal public navbar look.
* Investigated the issue where the admin navbar color changed after page loading and identified that temporary body classes should not be relied on for permanent navbar styling.
* Adjusted the navbar logic direction so permanent navbar classes should be used for admin-specific styling.
* Improved mobile navbar alignment, hamburger positioning, and dropdown width handling.
* Worked on making Admin and Logout action buttons visually balanced on both normal pages and admin pages.
* Added current-page active link behavior for the main public navbar so the current page link can glow like the admin navbar.
* Reviewed the existing `script.js` navbar logic and identified duplicate global nav patch code and conflicting active-link behavior.
* Found that the old section-based scroll active-link script could remove the active class from normal page links.
* Planned a safer active-link system that separates same-page `#section` links from full-page `.html` links.
* Worked on Career Guidance page mobile layout improvements.
* Fixed the mobile thumbnail display issue for Career Guidance article cards.
* Fixed the featured Career Guidance thumbnail layout on mobile so it fills the card properly without an awkward black frame.
* Started fixing clickable behavior for Career Guidance article containers so users can open articles by clicking the card area, not only the Explore button.
* Improved the visual color consistency of admin pages such as MCQ Manager, Career Article Manager, and Papers Manager.
* Preserved the MCQ Danger Zone red warning style while adjusting surrounding admin colors.
* Adjusted form fields, select boxes, search bars, and panels so they fit the updated dark premium admin style.
* Improved the Clerk login/signup color styling, especially the Continue with Google button and Clerk footer/dev-mode area.
* Improved default fallback thumbnails for MCQ, Notes, and Papers cards so broken or plain thumbnail areas look cleaner.
* Removed unwanted yellow glow/ray effects from default thumbnails while keeping the dark blue premium style.
* Explored homepage visual improvement ideas, especially decorative side-line designs near the main logo.
* Planned a more effective homepage visual approach using reusable decorative assets such as SVG overlays instead of relying only on complex CSS gradients.
* Discussed future frontend improvement direction, including why React or templates can help structure the project but will not automatically solve visual design problems without strong UI assets and styling.

## Problems Faced

* The previous documentation sounded too final even though the project is still under development.
* Some documentation lines made the project sound completed instead of still being improved.
* The profile introduction needed to be short, clean, and professional.
* The selected profile/theme colors needed to match the preferred red, black, and white style while staying readable.
* The GPRM/profile input showed an invalid message, so the input needed cleaner formatting.
* The Contact page had been hidden or disabled earlier, which caused confusion while restoring it.
* The Contact link did not appear properly in the mobile hamburger menu.
* The admin navbar incorrectly showed Contact, which was unnecessary for admin pages.
* The View Site option was visible on desktop admin navbar but not consistently available inside the mobile hamburger menu.
* Mobile dropdowns inside the hamburger menu were not working correctly, and only one option appeared in some cases.
* The admin navbar color changed after the page finished loading because styling depended on temporary page state classes.
* The hamburger icon and mobile dropdown alignment became inconsistent because public navbar CSS and admin navbar CSS were affecting each other.
* The mobile dropdown width was being affected by `.navbar-inner`, causing the menu to look boxed-in instead of full-width.
* Admin and Logout buttons looked uneven because their width was based on text length instead of a controlled button size.
* The Notes link stayed active because some navbar markup had the active class hardcoded instead of being controlled dynamically.
* The main public navbar did not yet have a reliable current-page active glow system.
* The existing `script.js` contained duplicate nav patch blocks, which made navigation behavior harder to maintain.
* The old scroll-based active nav script targeted all `.nav-link` elements and could remove active states from normal page navigation.
* Career Guidance thumbnails looked awkward on mobile because the image fitting created unwanted spacing or black framing.
* The featured Career Guidance thumbnail also needed a separate mobile fix.
* Some Career Guidance article cards were not fully clickable because only the inner Explore/read button handled navigation.
* Admin Career and Admin Papers pages still had color mismatches after the general theme changes.
* Some admin controls inherited gold styling even inside the Danger Zone, where red danger styling was expected.
* Clerk authentication UI used default colors that did not fully match the Karthificial theme.
* Default thumbnails for MCQ, Notes, and Papers looked plain or broken when custom thumbnails were not available.
* Some decorative CSS ideas became too large and difficult to manage, especially for hero side-line designs.

## How We Fixed It

* Rewrote the documentation in a more honest progress-based style.
* Removed wording that made the project sound fully completed.
* Kept the documentation focused on current improvements, fixes, and project refinement.
* Simplified the profile introduction so it fits better in a public developer profile.
* Suggested cleaner theme color choices matching the preferred red, black, and white direction.
* Planned the MCQ analytics delete history system with a reusable confirmation modal.
* Defined that analytics deletion must require typing `DELETE` before action.
* Restored the Contact page with two responsive experiences:

  * Desktop: contact wheel layout.
  * Mobile/tablet: simple contact cards.

* Fixed the mobile navbar dropdown behavior so dropdowns can open inside the hamburger menu.
* Added JavaScript support for tapping dropdowns on mobile.
* Adjusted navbar logic so Contact appears on normal pages but not on admin pages.
* Kept the desktop admin View Site button unchanged while adding View Site inside the mobile hamburger menu.
* Scoped admin navbar styling to the permanent `.admin-navbar` class instead of relying only on temporary body classes.
* Improved the mobile navbar direction by separating admin and public navbar styling.
* Planned a cleaner navbar layout where the logo, hamburger icon, and action buttons each have controlled space.
* Identified that dropdown menus should be positioned relative to the full navbar, not trapped inside `.navbar-inner`.
* Adjusted the button sizing approach so action buttons can be more visually balanced.
* Identified the hardcoded active class issue and planned dynamic active-link handling for public navigation.
* Replaced the idea of a broad active-link script with a safer page-based active-link function.
* Separated section-based active logic so it only affects same-page `#section` links.
* Improved Career Guidance mobile thumbnail CSS using a proper card-filling image layout.
* Fixed the featured thumbnail separately so it looks like a proper blog-style image on mobile.
* Started debugging article card click behavior and identified that dynamic article cards need a delegated click handler because they are loaded later through JavaScript.
* Used admin-page-specific CSS targeting so Admin Career and Admin Papers can match the admin dashboard look without affecting public pages.
* Protected the MCQ Danger Zone red warning design separately so it does not inherit normal gold form styling.
* Adjusted default thumbnail styles using fallback card styling instead of relying on broken image output.
* Removed the unwanted yellow radial glow from default thumbnails while keeping the dark blue fallback box.
* Improved Clerk authentication colors by targeting Clerk-specific classes such as the Google button and footer area.
* Compared CSS-only decorative hero designs with an asset-based approach and decided that an SVG overlay would be cleaner for premium side-line designs.

## What We Learned

* Documentation should match the real project stage and should not make an ongoing project sound finished.
* A profile introduction should be short, direct, and professional.
* Theme colors should match the project identity while maintaining readability.
* Admin features should be scoped carefully so public navigation items do not appear unnecessarily in admin pages.
* Mobile hamburger menus need separate handling for dropdowns because hover-based desktop dropdown logic does not work well on touch screens.
* Temporary body classes are not reliable for permanent styling because JavaScript can remove or change them after loading.
* Permanent classes such as `.admin-navbar` are safer for page-specific styling.
* Public navbar CSS and admin navbar CSS should be separated to avoid unexpected visual changes.
* Mobile navbar layout needs special care because logo text, hamburger icons, and action buttons compete for limited space.
* Full-width mobile dropdowns should be positioned from the navbar container instead of being restricted by the inner navbar wrapper.
* JavaScript fixes should account for dynamically loaded content, especially when cards are created after the page loads.
* Active navigation scripts should not remove active classes from every nav link unless they are meant to control all nav systems.
* Same-page section navigation and multi-page navigation should be handled separately.
* Mobile image layouts need different handling from desktop layouts.
* `object-fit: contain` can preserve the full image but may create awkward framing, while `object-fit: cover` often gives a better blog/card thumbnail look.
* A reusable confirmation modal is better than repeated browser alerts or basic confirm boxes for admin actions.
* Delete actions should be designed safely, especially when they affect student performance history or analytics data.
* Default thumbnails are important because missing thumbnails can make the site look unfinished.
* Clerk components need targeted color overrides because they use their own generated classes.
* For complex decorative designs, a real SVG or image overlay can be cleaner and easier to maintain than large CSS-only gradient effects.
* React or templates can help organize the frontend later, but they do not replace the need for strong design decisions, consistent assets, and careful styling.

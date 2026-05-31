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
* Worked on Career Guidance page mobile layout improvements.
* Fixed the mobile thumbnail display issue for Career Guidance article cards.
* Fixed the featured Career Guidance thumbnail layout on mobile so it fills the card properly without an awkward black frame.
* Started fixing clickable behavior for Career Guidance article containers so users can open articles by clicking the card area, not only the Explore button.

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
* Career Guidance thumbnails looked awkward on mobile because the image fitting created unwanted spacing or black framing.
* The featured Career Guidance thumbnail also needed a separate mobile fix.
* Some Career Guidance article cards were not fully clickable because only the inner Explore/read button handled navigation.

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
* Improved Career Guidance mobile thumbnail CSS using a proper card-filling image layout.
* Fixed the featured thumbnail separately so it looks like a proper blog-style image on mobile.
* Started debugging article card click behavior and identified that dynamic article cards need a delegated click handler because they are loaded later through JavaScript.

## What We Learned

* Documentation should match the real project stage and should not make an ongoing project sound finished.
* A profile introduction should be short, direct, and professional.
* Theme colors should match the project identity while maintaining readability.
* Admin features should be scoped carefully so public navigation items do not appear unnecessarily in admin pages.
* Mobile hamburger menus need separate handling for dropdowns because hover-based desktop dropdown logic does not work well on touch screens.
* JavaScript fixes should account for dynamically loaded content, especially when cards are created after the page loads.
* Mobile image layouts need different handling from desktop layouts.
* `object-fit: contain` can preserve the full image but may create awkward framing, while `object-fit: cover` often gives a better blog/card thumbnail look.
* A reusable confirmation modal is better than repeated browser alerts or basic confirm boxes for admin actions.
* Delete actions should be designed safely, especially when they affect student performance history or analytics data.

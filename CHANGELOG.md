# TODO
- **BC**: Change ecs ami to a free one
- **BC**: Integrate with email automation service
- **BF**: Solve issue related to double beans
- **BC**: Separate API from front-end with NGINX
- **FR**: expose error path
- **FR**: Schedule Training Assignment
- **FR**: Recurring events in Gym Calendar

- **Chapter II** More Features
    - Separate TimeOff into Holidays and (Employee) TimeOff 
    - Investigate better solutions for Reservation
    - Add ATrainingBundleSpecification tests
    - Add ATrainingBundle tests
    - Add CourseTrainingBundle to SaleFacade tests
    
- **Chapter III** Gym-relative calls
    - Add gymId as PathVariable to API calls
    - Set Gym during user registration (re-visit registration logic)

# DONE
- **Chapter II** More Features
    - Replace Admin with Gym in Sale
    - Added CreateAt to ATrainingBundle
    - Added CreateAt to Gym
    - Added CreateAt to Sale
    - Added CourseBundle, CourseBundleSpecs, CourseSession
    - Added CourseBundleSpecs creation in UI
    - Added CourseBundleSpecs modification in UI
    - Added Tests to Sale
    - Added Development fixtures in InitDatabase
    - Fixed Issue related to the *Favicon.ico not correctly loaded*
    - Fixed bug changePassword NotFound

- **Chapter I** Hide Repositories behind Services and Controllers
   - Refactoring Authentication Service w tests
   - Created Mail Service w tests
   - Created Role Service w tests
   - Removed Rest API from Role Repository 
   - Removed Rest API from SalesLineItem Repository 
   - Removed Rest API from Verification Token Repository 
   - Removed Rest API from Trainer Repository
   - Added Authentication Facade w tests
   - Added Customer Controller w tests
   - Removed Rest API from Customer Repository
   - Changed authentication endpoints names
   - Refactored User Controller w tests
   - Removed Rest API on User Repository
   - Removed Rest API from Gym Repository
   - Added Gym Controller
   - Removed PersonalTrainingBundleSpecification Repository
   - Removed Rest API from TrainingBundleSpecification Repository
   - Added TrainingBundleSpecification Service w tests
   - Removed Rest API from TrainingBundleSession Repository
   - Removed Rest API from TrainingBundle Repository
   - Removed Rest API from Reservation Repository 
   - Created Session Service
   - Removed Session Repository from Reservation Facade
   - Added @Data and @EqualsAndHashCode to each of class in model
   - Removed Rest API from TimeOff Repository
   - Error *"Hai già effettuato una chiusura" when booking time off one hour before a previous time off* Fixed
   
- **BF**: Email not valid
- **BF**: Typo in gym configuration
- **FR**: Changed gym configuration and depending events in Calendar

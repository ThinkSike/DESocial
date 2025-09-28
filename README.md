# DESocial - Campus Social Media App

A comprehensive React Native (Expo) + Firebase mobile application designed exclusively for DES Pune University students. DESocial centralizes campus communication, connects students through forums, announcements, interest groups ("Tribes"), lost & found, and provides a real-time campus experience.

## 🎯 Project Overview

DESocial is a campus-exclusive social media platform that serves as the central hub for all DES Pune University student interactions, featuring:

- **Secure Authentication**: PRN-based login with barcode verification
- **Home Feed**: Text/image posts with likes and threaded comments
- **Q&A Forum**: Course-tagged questions with upvote/downvote system
- **Announcements**: Role-based posting with push notifications
- **Tribes**: Interest-based groups with chat, polls, and meetup scheduling
- **Lost & Found**: Camera upload with campus map geo-tagging
- **Around You Map**: Real-time geofenced events and campus activities

## 🚀 Tech Stack

### Frontend
- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native)
- **React Navigation 7** for routing
- **Expo Router** for file-based navigation

### Backend & Services
- **Firebase Authentication** (Multi-factor with PRN validation)
- **Cloud Firestore** (Real-time database with offline support)
- **Firebase Cloud Storage** (Image and file uploads)
- **Firebase Cloud Functions** (Server-side logic)
- **Firebase Cloud Messaging** (Push notifications)

### Additional Features
- **Expo Camera** & **Image Picker** for media capture
- **Expo Location** for geolocation services
- **Expo Barcode Scanner** for student ID verification
- **React Native Maps** for campus map integration

## 📱 Core Features

### 1. Authentication System
- **PRN-based Login**: 11-digit Permanent Registration Number validation
- **Barcode Verification**: Student ID card scanning for account verification
- **Multi-factor Authentication**: Enhanced security for campus-only access
- **Password Recovery**: Secure reset via university email

### 2. Home Feed
- **Rich Posts**: Text and image content creation
- **Interactive Engagement**: Like, comment, and share functionality
- **Threaded Comments**: Nested conversation support
- **Real-time Updates**: Live feed updates via Firestore listeners

### 3. Q&A Forum
- **Course-Tagged Questions**: Organized by academic subjects
- **Voting System**: Community-driven upvote/downvote mechanism
- **Best Answer Selection**: Question authors can mark helpful responses
- **Moderation Queue**: Admin oversight for quality control

### 4. Announcements Hub
- **Role-based Posting**: Admin and Student Council privileges
- **Priority Levels**: Urgent, High, Medium, Low classifications
- **Category Filtering**: Academic, Events, Clubs, Placement, General
- **Push Notifications**: FCM integration for important updates
- **Calendar Integration**: iCal export for events

### 5. Tribes (Interest Groups)
- **Group Creation**: Student-led community building
- **Join/Leave Management**: Flexible membership control
- **Group Chat**: Real-time messaging within tribes
- **Polls & Voting**: Community decision-making tools
- **Meetup Scheduler**: Event planning and RSVP tracking

### 6. Lost & Found Board
- **One-tap Camera Upload**: Quick item reporting
- **Campus Map Integration**: GeoPoint tagging for precise location
- **Claimed/Unclaimed Toggle**: Status tracking system
- **Category Organization**: Electronics, Documents, Accessories, etc.
- **Real-time Notifications**: Instant alerts for matches

### 7. Around You Map *(Coming Soon)*
- **Real-time Events**: Live campus activity tracking
- **Geofenced Notifications**: Location-based alerts
- **Event Clustering**: Distance and time-based grouping
- **Filter Chips**: Club events, classes, lost items, social gatherings

## 🏗️ Project Structure

```
DESocial/
├── app/                        # Expo Router pages
│   ├── (tabs)/                # Tab navigation screens
│   │   ├── index.tsx          # Home feed
│   │   ├── forum.tsx          # Q&A forum
│   │   ├── announcements.tsx  # University announcements
│   │   ├── tribes.tsx         # Interest groups
│   │   └── more.tsx           # Settings & profile
│   ├── login.tsx              # Authentication screen
│   ├── register.tsx           # User registration
│   ├── barcode-scanner.tsx    # ID verification
│   └── _layout.tsx            # Root navigation layout
├── config/
│   └── firebase.ts            # Firebase configuration
├── contexts/
│   └── AuthContext.tsx        # Authentication state management
├── services/                   # Firebase service layers
│   ├── authService.ts         # Authentication logic
│   ├── postService.ts         # Home feed operations
│   ├── forumService.ts        # Q&A functionality
│   └── lostFoundService.ts    # Lost & found features
├── types/
│   └── index.ts               # TypeScript interfaces
├── assets/                    # Static resources
├── firebase.json              # Firebase project config
├── firestore.rules           # Database security rules
├── firestore.indexes.json    # Query optimization
├── storage.rules             # File storage security
├── tailwind.config.js        # NativeWind styling config
└── package.json              # Dependencies & scripts
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase account and project
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-repo/DESocial.git
cd DESocial
npm install
```

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, Storage, and Cloud Functions
3. Download configuration files:
   - `google-services.json` for Android
   - `GoogleService-Info.plist` for iOS
4. Update `config/firebase.ts` with your project credentials

### 3. Deploy Firebase Rules & Functions
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy security rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 4. Configure Environment
```bash
# Update app.json with your Firebase config
# Note: For Expo managed workflow, Firebase config is handled via config/firebase.ts
# The google-services.json and GoogleService-Info.plist files are not needed for Expo managed workflow
```

### 5. Run Development Server
```bash
# Start Expo development server
npm start

# Run on specific platform
npm run android
npm run ios
```

## 🔐 Security & Permissions

### Firestore Security Rules
- **User Authentication**: All operations require valid authentication
- **PRN Validation**: 11-digit format enforcement
- **Role-based Access**: Admin privileges for announcements and moderation
- **Data Ownership**: Users can only modify their own content
- **Privacy Controls**: Tribe-specific content access restrictions

### Required Permissions
- **Camera**: Photo capture for posts and lost items
- **Photo Library**: Image selection and sharing
- **Location**: Campus map and geo-tagging features
- **Microphone**: Voice messages in tribe chats
- **Notifications**: Push alerts for important updates

## 📊 Database Schema

### Core Collections
- `users` - Student profiles and authentication data
- `posts` - Home feed content with engagement metrics
- `comments` - Threaded discussions on posts
- `forumPosts` - Q&A questions with course tags
- `forumAnswers` - Community responses and solutions
- `announcements` - Official university communications
- `tribes` - Interest-based group information
- `tribePosts` - Group-specific content and polls
- `lostFound` - Campus lost and found items
- `mapEvents` - Real-time campus activities
- `notifications` - Push notification records

## 🔮 Future Enhancements

### Phase 2 Features
- **Advanced Map Layer**: Heat-map visualization of campus activity
- **Survey Module**: Student feedback and opinion collection
- **AI Moderation**: Automated content filtering and safety
- **Advanced Analytics**: Usage patterns and engagement insights
- **Offline-First Architecture**: Enhanced performance and reliability

### Phase 3 Features
- **Multi-campus Support**: Expansion to other DES institutions
- **Alumni Network**: Extended community engagement
- **Academic Integration**: Direct LMS and portal connections
- **Advanced Notifications**: Smart filtering and personalization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Implement proper error handling
- Add unit tests for critical functions
- Follow React Native performance guidelines
- Maintain consistent code formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

For technical support or feature requests:
- **Email**: support@desocial.app
- **Issues**: [GitHub Issues](https://github.com/your-repo/DESocial/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/DESocial/wiki)

---

**Built with ❤️ for DES Pune University Students**

*DESocial - Connecting Minds, Building Community*
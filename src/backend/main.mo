import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";

actor {
  // Include available components
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type CaptionProject = {
    title : Text;
    videoUrl : ?Text;
    captions : [CaptionSegment];
    thumbnailUrl : ?Text;
    createdAt : Time.Time;
    language : Text;
  };

  type CaptionSegment = {
    start : Nat;
    end : Nat;
    text : Text;
  };

  type TemporalCaptionProject = {
    project : CaptionProject;
    deletionTime : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    photoUrl : ?Text;
    coins : Nat;
    isPro : Bool;
    proExpiry : ?Time.Time;
  };

  type CaptionRequest = {
    videoBlobId : Text;
    language : Text;
  };

  type RazorpayOrder = {
    id : Text;
    amount : Nat;
    currency : Text;
    status : Text;
    createdAt : Time.Time;
  };

  type RazorpayPaymentVerification = {
    orderId : Text;
    paymentId : Text;
    signature : Text;
  };

  // In-memory storage using core library modules
  let profiles = Map.empty<Principal, UserProfile>();
  let projects = Map.empty<Principal, List.List<CaptionProject>>();
  let temporalProjects = Map.empty<Principal, List.List<TemporalCaptionProject>>();
  let razorpayOrders = Map.empty<Text, RazorpayOrder>();

  module CaptionProject {
    public func compareByCreatedAtThenTitle(project1 : CaptionProject, project2 : CaptionProject) : Order.Order {
      switch (Int.compare(project1.createdAt, project2.createdAt)) {
        case (#equal) { Text.compare(project1.title, project2.title) };
        case (order) { order };
      };
    };
  };

  module TemporalCaptionProject {
    public func compareByDeletionTimeThenProject(temporalProject1 : TemporalCaptionProject, temporalProject2 : TemporalCaptionProject) : Order.Order {
      switch (Int.compare(temporalProject1.deletionTime, temporalProject2.deletionTime)) {
        case (#equal) { CaptionProject.compareByCreatedAtThenTitle(temporalProject1.project, temporalProject2.project) };
        case (order) { order };
      };
    };
  };

  let CAPTION_COST = 30;
  let INITIAL_COINS = 200;
  let PRO_PLAN_DAYS = 3;

  public shared ({ caller }) func createCaptionProject(title : Text, videoUrl : ?Text, captions : [CaptionSegment], thumbnailUrl : ?Text, language : Text) : async () {
    requireUser(caller);

    // Check if title already exists
    let existingProjects = projects.get(caller);
    let hasDuplicate = switch (existingProjects) {
      case (null) { false };
      case (?projectsList) {
        projectsList.values().any(
          func(project) {
            project.title == title;
          }
        );
      };
    };
    if (hasDuplicate) {
      Runtime.trap("Project with this title already exists");
    };

    let newProject : CaptionProject = {
      title;
      videoUrl;
      captions;
      thumbnailUrl;
      createdAt = Time.now();
      language;
    };

    // Add new project at the beginning of the list
    let updatedProjects = switch (existingProjects) {
      case (null) { List.fromArray<CaptionProject>([newProject]) };
      case (?projectsList) {
        let newList = List.fromArray<CaptionProject>([newProject]);
        newList.add(newProject);
        newList;
      };
    };
    projects.add(caller, updatedProjects);
  };

  public shared ({ caller }) func deleteCaptionProject(title : Text) : async () {
    requireUser(caller);

    switch (projects.get(caller)) {
      case (null) { Runtime.trap("Project not found") };
      case (?projectsList) {
        let filteredProjects = projectsList.filter(
          func(project) { project.title != title }
        );
        projects.add(caller, filteredProjects);
      };
    };
  };

  public shared ({ caller }) func deleteCaptionProjectWithCooldown(title : Text) : async () {
    requireUser(caller);

    switch (projects.get(caller)) {
      case (null) { Runtime.trap("Project not found") };
      case (?projectsList) {
        let filteredProjects = projectsList.filter(
          func(project) { project.title != title }
        );
        projects.add(caller, filteredProjects);

        // Find the deleted project and store it temporarily with a deletion timestamp
        let deletedProject = projectsList.values().find(
          func(project) { project.title == title }
        );

        switch (deletedProject) {
          case (?project) {
            let temporalProject : TemporalCaptionProject = {
              project;
              deletionTime = Time.now();
            };

            switch (temporalProjects.get(caller)) {
              case (null) {
                let newList = List.fromArray<TemporalCaptionProject>([temporalProject]);
                temporalProjects.add(caller, newList);
              };
              case (?existingTemporal) {
                let newList = List.fromArray<TemporalCaptionProject>([temporalProject]);
                newList.add(temporalProject);
                temporalProjects.add(caller, newList);
              };
            };
          };
          case (null) {};
        };
      };
    };
  };

  public shared ({ caller }) func generateCaptions(request : CaptionRequest) : async [CaptionSegment] {
    requireUser(caller);

    // Get user profile
    let userProfile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    // Check if user is Pro and if Pro plan is still valid
    let isPro = userProfile.isPro and (switch (userProfile.proExpiry) {
      case (null) { false };
      case (?expiry) { Time.now() < expiry };
    });

    // Check if user has enough coins (unless Pro)
    if (not isPro and userProfile.coins < CAPTION_COST) {
      Runtime.trap("Insufficient coins. Please purchase more coins or upgrade to Pro.");
    };

    // Deduct coins if not Pro
    if (not isPro) {
      let updatedProfile : UserProfile = {
        userProfile with
        coins = userProfile.coins - CAPTION_COST;
      };
      profiles.add(caller, updatedProfile);
    };

    // Placeholder for API call
    [
      {
        start = 0;
        end = 1000;
        text = "This is a caption";
      },
    ];
  };

  public shared ({ caller }) func createRazorpayOrder(amount : Nat, currency : Text) : async ?Text {
    requireUser(caller);

    let orderId = "order_" # generateRandomId();
    let order : RazorpayOrder = {
      id = orderId;
      amount;
      currency;
      status = "created";
      createdAt = Time.now();
    };
    razorpayOrders.add(orderId, order);

    ?orderId;
  };

  public shared ({ caller }) func verifyRazorpayPayment(verification : RazorpayPaymentVerification) : async Bool {
    requireUser(caller);

    // Ensure order exists
    switch (razorpayOrders.get(verification.orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?_order) {
        // Simulate verification (should call HTTP outcall in real system)
        let isValid = verification.signature == "valid";
        if (isValid) {
          activateProPlan(caller);
        };
        isValid;
      };
    };
  };

  func activateProPlan(user : Principal) {
    let existingProfile = switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    let newProfile : UserProfile = {
      existingProfile with
      coins = INITIAL_COINS;
      isPro = true;
      proExpiry = ?(Time.now() + (PRO_PLAN_DAYS * 24 * 60 * 60 * 1_000_000_000));
    };
    profiles.add(user, newProfile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access other users' profiles");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    requireUser(caller);
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getLibrary() : async [CaptionProject] {
    requireUser(caller);
    let userProjectsList = switch (projects.get(caller)) {
      case (null) { List.empty<CaptionProject>() };
      case (?projectsList) { projectsList };
    };

    let sortedProjects = userProjectsList.toArray().sort(CaptionProject.compareByCreatedAtThenTitle);
    sortedProjects;
  };

  public query ({ caller }) func getProject(title : Text) : async ?CaptionProject {
    requireUser(caller);
    switch (projects.get(caller)) {
      case (null) { null };
      case (?projectsList) {
        projectsList.values().find(
          func(project) { project.title == title }
        );
      };
    };
  };

  public query ({ caller }) func getTemporaryProjects() : async [TemporalCaptionProject] {
    requireUser(caller);
    let userTemporalProjectsList = switch (temporalProjects.get(caller)) {
      case (null) { List.empty<TemporalCaptionProject>() };
      case (?temporalProjectsList) { temporalProjectsList };
    };

    let sortedTemporalProjects = userTemporalProjectsList.toArray().sort(TemporalCaptionProject.compareByDeletionTimeThenProject);
    sortedTemporalProjects;
  };

  func requireUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  // Helper function to generate a pseudo-random ID (for demonstration purposes)
  func generateRandomId() : Text {
    Time.now().toText();
  };
};

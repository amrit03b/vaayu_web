module onboarding::onboarding {
    use std::string::String;
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    // ✨ Events (module-event model)
    #[event]
    struct ProfileCreatedEvent has drop, store {
        user_address: address,
        name: String,
        age: u8,
        location: String,
    }

    #[event]
    struct ProfileUpdatedEvent has drop, store {
        user_address: address,
        name: String,
        age: u8,
        location: String,
    }

    // Error codes
    const E_PROFILE_NOT_FOUND: u64 = 2;

    // 👥 UserProfile stored on-chain; add `drop` so it can be removed with `move_from`
    struct UserProfile has key, store, drop {
        name: String,
        age: u8,
        gender: String,
        chronic_conditions: vector<String>,
        preferred_walk_time: String,
        pollution_sensitivity: String,
        location: String,
        created_at: u64,
    }

    /// Create or update user profile and emit event
    public entry fun set_profile(
        account: &signer,
        name: String,
        age: u8,
        gender: String,
        chronic_conditions: vector<String>,
        preferred_walk_time: String,
        pollution_sensitivity: String,
        location: String,
    ) acquires UserProfile {
        let addr = signer::address_of(account);
        let now = timestamp::now_seconds();

        if (exists<UserProfile>(addr)) {
            let p = borrow_global_mut<UserProfile>(addr);
            p.name = name;
            p.age = age;
            p.gender = gender;
            p.chronic_conditions = chronic_conditions;
            p.preferred_walk_time = preferred_walk_time;
            p.pollution_sensitivity = pollution_sensitivity;
            p.location = location;

            event::emit(ProfileUpdatedEvent { user_address: addr, name, age, location });
        } else {
            let profile = UserProfile { name, age, gender, chronic_conditions,
                                        preferred_walk_time, pollution_sensitivity,
                                        location, created_at: now };
            move_to(account, profile);
            event::emit(ProfileCreatedEvent { user_address: addr, name, age, location });
        }
    }

    // This function is kept for backward compatibility. It performs a destructive read and should not be used.
    public fun get_profile(account: address): UserProfile acquires UserProfile {
        assert!(exists<UserProfile>(account), E_PROFILE_NOT_FOUND);
        move_from<UserProfile>(account)
    }

    #[view]
    public fun view_profile(account: address): (String, u8, String, vector<String>, String, String, String) acquires UserProfile {
        assert!(exists<UserProfile>(account), E_PROFILE_NOT_FOUND);
        let profile = borrow_global<UserProfile>(account);
        (
            profile.name,
            profile.age,
            profile.gender,
            profile.chronic_conditions,
            profile.preferred_walk_time,
            profile.pollution_sensitivity,
            profile.location
        )
    }

    #[view]
    public fun has_profile(account: address): bool {
        exists<UserProfile>(account)
    }

    /// Deletes profile; now allowed because of `drop` ability
    public entry fun delete_profile(account: &signer) acquires UserProfile {
        let addr = signer::address_of(account);
        assert!(exists<UserProfile>(addr), E_PROFILE_NOT_FOUND);
        let _p = move_from<UserProfile>(addr);
    }

    // Read-only getters
    public fun get_name(p: &UserProfile): &String { &p.name }
    public fun get_age(p: &UserProfile): u8 { p.age }
    public fun get_location(p: &UserProfile): &String { &p.location }
    public fun get_chronic_conditions(p: &UserProfile): &vector<String> { &p.chronic_conditions }
}

export function bootIntercom(user) {
  window.Intercom('boot', {
    app_id: process.env.INTERCOM_APP_ID,
    user_hash: user.intercomHash,
    user_id: user.id,
    email: user.email,
    name: user.fullName,
    created_at: user.createdAt,
    school_classes_count: user.schoolClassesCount,
    custom_launcher_selector: '.custom-intercom-launcher',
  });
}

export function updateIntercom() {
  window.Intercom('update');
}

export function shutdownIntercom() {
  window.Intercom('shutdown');
}

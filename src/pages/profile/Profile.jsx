import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiSave,
  FiEdit2,
  FiCamera,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiThumbsUp,
  FiUsers,
  FiCheckCircle,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiGlobe,
  FiCpu,
  FiActivity,
  FiUsers as FiUsersIcon,
  FiUser as FiUserIcon,
} from "react-icons/fi";
import useAuthStore from "../../stores/authStore";

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bio: "",
    location: "",
    occupation: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const selectedAvatar = user?.avatar || 1;
  const avatars = Array.from({ length: 12 }, (_, i) => i + 1);

  // Dummy stats data
  const stats = [
    {
      icon: FiTrendingUp,
      label: "Completed Tasks",
      value: "247",
      change: "+12%",
      color: "green",
    },
    {
      icon: FiStar,
      label: "Rating",
      value: "4.9",
      change: "+0.3",
      color: "yellow",
    },
    {
      icon: FiThumbsUp,
      label: "Achievements",
      value: "18",
      change: "+2",
      color: "blue",
    },
    {
      icon: FiUsers,
      label: "Team Members",
      value: "6",
      change: "+1",
      color: "purple",
    },
  ];

  // Dummy activity data
  const activities = [
    {
      icon: FiCheckCircle,
      title: "Completed Project Alpha",
      time: "2 hours ago",
      color: "green",
    },
    {
      icon: FiAward,
      title: 'Received "Star Performer" badge',
      time: "1 day ago",
      color: "yellow",
    },
    {
      icon: FiEdit2,
      title: "Updated project documentation",
      time: "2 days ago",
      color: "purple",
    },
  ];

  // Dummy skills data
  const skills = [
    { name: "React", level: 92, color: "blue" },
    { name: "TypeScript", level: 85, color: "indigo" },
    { name: "Node.js", level: 78, color: "green" },
    { name: "UI/UX Design", level: 70, color: "purple" },
  ];

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        bio:
          user.bio ||
          "Passionate developer with 5+ years of experience in building amazing web applications.",
        location: user.location || "San Francisco, CA",
        occupation: user.occupation || "Senior Full Stack Developer",
        website: user.website || "https://portfolio.com",
        github: user.github || "https://github.com/username",
        twitter: user.twitter || "https://twitter.com/username",
        linkedin: user.linkedin || "https://linkedin.com/in/username",
      });
    }
  }, [user]);

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await updateProfile(form);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset form to current user data if canceling
      if (user) {
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          dob: user.dob || "",
          gender: user.gender || "",
          bio: user.bio || "",
          location: user.location || "",
          occupation: user.occupation || "",
          website: user.website || "",
          github: user.github || "",
          twitter: user.twitter || "",
          linkedin: user.linkedin || "",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-[#1a1a1a] overflow-hidden shadow-xl"
        >
          {/* Cover Image - Using theme image */}
          <div
            className="relative h-56 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/themes/1.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

            {/* User Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group -mb-8 md:-mb-8">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-2xl group-hover:ring-orange-500/40 transition-all duration-300">
                  <img
                    src={`/avatars/${selectedAvatar}.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fb = e.target.nextSibling;
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/30 dark:to-orange-600/30 items-center justify-center text-orange-600 dark:text-orange-400 text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                  >
                    <FiCamera size={14} />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                    {user?.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">
                    <FiUserIcon className="w-3.5 h-3.5" />
                    {user?.role || "Specialist"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-500/20 backdrop-blur-sm text-green-400 text-xs font-bold border border-green-500/30">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1.5 text-white/90 text-sm">
                  <span className="flex items-center gap-1.5">
                    <FiMail className="w-4 h-4" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="w-4 h-4" />
                    {form.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiBriefcase className="w-4 h-4" />
                    {form.occupation}
                  </span>
                </div>
              </div>

              {/* Edit/Save Button */}
              <div className="flex gap-2 mt-2 md:mt-0">
                {!isEditing ? (
                  <button
                    onClick={toggleEdit}
                    className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm font-bold border border-white/30"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-lg shadow-orange-500/30"
                  >
                    <FiSave className="w-4 h-4" />
                    {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Avatar Picker */}
          <AnimatePresence>
            {showAvatarPicker && isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pt-4 pb-6"
              >
                <div className="p-5 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#1a1a1a]">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiCamera className="w-4 h-4" />
                    Select Avatar
                  </h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                    {avatars.map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          updateProfile({ avatar: num });
                          setShowAvatarPicker(false);
                        }}
                        className={`w-full aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-300 ${
                          num === selectedAvatar
                            ? "ring-orange-500 ring-4 scale-105 shadow-lg"
                            : "ring-gray-200 dark:ring-gray-700 hover:ring-orange-500/50 hover:scale-105"
                        }`}
                      >
                        <img
                          src={`/avatars/${num}.jpg`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Section */}
          <div className="px-6 pt-6 pb-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colorMap = {
                  green:
                    "text-green-500 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20",
                  yellow:
                    "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20",
                  blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
                  purple:
                    "text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
                };
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#0f0f0f] hover:border-orange-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {stat.value}
                        </p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border ${colorMap[stat.color]}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="inline-block mt-2 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-lg">
                      {stat.change}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiUserIcon className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h3>

                {!isEditing ? (
                  // View Mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a]">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">
                        {form.name}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a]">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">
                        {form.email}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a]">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Phone
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">
                        {form.phone || "Not provided"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a]">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">
                        {form.dob || "Not provided"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a]">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Gender
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1 capitalize">
                        {form.gender || "Not specified"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a]">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">
                        {form.location}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1a1a1a] md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bio
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">
                        {form.bio}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            value={form.name}
                            onChange={update("name")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Email
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="email"
                            value={form.email}
                            onChange={update("email")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Phone
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={update("phone")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="date"
                            value={form.dob}
                            onChange={update("dob")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Gender
                        </label>
                        <select
                          value={form.gender}
                          onChange={update("gender")}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Location
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            value={form.location}
                            onChange={update("location")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          Bio
                        </label>
                        <textarea
                          value={form.bio}
                          onChange={update("bio")}
                          rows="3"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Column - Skills & Activity */}
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FiCpu className="w-5 h-5 text-orange-500" />
                    Skills
                  </h3>
                  <div className="space-y-3">
                    {skills.map((skill, index) => {
                      const colorMap = {
                        blue: "from-blue-500 to-blue-600",
                        indigo: "from-indigo-500 to-indigo-600",
                        green: "from-green-500 to-green-600",
                        purple: "from-purple-500 to-purple-600",
                      };
                      return (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {skill.name}
                            </span>
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-[#1a1a1a] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full bg-gradient-to-r ${colorMap[skill.color]}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FiActivity className="w-5 h-5 text-orange-500" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2">
                    {activities.map((activity, index) => {
                      const Icon = activity.icon;
                      const colorMap = {
                        green: "text-green-500 bg-green-50 dark:bg-green-500/10",
                        yellow:
                          "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
                        purple:
                          "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
                      };
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f0f0f] transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-[#1a1a1a]"
                        >
                          <div className={`p-2 rounded-lg ${colorMap[activity.color]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FiGlobe className="w-5 h-5 text-orange-500" />
                    Social Links
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={form.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-300 group"
                    >
                      <FiGithub className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-500 truncate">GitHub</span>
                    </a>
                    <a
                      href={form.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-300 group"
                    >
                      <FiTwitter className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-500 truncate">Twitter</span>
                    </a>
                    <a
                      href={form.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-300 group"
                    >
                      <FiLinkedin className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-500 truncate">LinkedIn</span>
                    </a>
                    <a
                      href={form.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-300 group"
                    >
                      <FiGlobe className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-500 truncate">Website</span>
                    </a>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] opacity-50">
                      <FiUsersIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">+2 more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
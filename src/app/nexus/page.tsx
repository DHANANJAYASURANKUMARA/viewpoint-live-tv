"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Calendar,
    Mail,
    Globe,
    Camera,
    Save,
    Share2,
    Facebook,
    Twitter,
    Linkedin as LinkedIn,
    Instagram,
    Gift,
    Sparkles,
    Eye,
    EyeOff,
    Heart,
    X,
    MessageSquare,
    ThumbsUp,
    Trash2,
    Edit3,
    Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    updateUserProfile,
    getUserProfile,
    createPost,
    getPosts,
    toggleLike,
    addComment,
    deletePost,
    updatePost
} from "@/lib/actions";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/imageUtils";

export default function NexusProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [isBirthday, setIsBirthday] = useState(false);
    const [socialModal, setSocialModal] = useState<string | null>(null);

    // Feed State
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'feed'>('profile');
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
    const [editingPost, setEditingPost] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    // Avatar Cropping State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("vpoint-user");
        if (session) {
            try {
                const sessionUser = JSON.parse(session);
                loadProfile(sessionUser.id);
            } catch {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const loadProfile = async (userId: string) => {
        const fullProfile = await getUserProfile(userId);
        if (fullProfile) {
            let socials = { twt: '', fb: '', li: '', ig: '' };
            try {
                if (fullProfile.socialLinks) {
                    socials = { ...socials, ...JSON.parse(fullProfile.socialLinks) };
                }
            } catch { }

            setUser({ ...fullProfile, socialLinks: socials });

            if (fullProfile.birthday) {
                const bday = new Date(fullProfile.birthday);
                const today = new Date();
                if (bday.getDate() === today.getDate() && bday.getMonth() === today.getMonth()) {
                    setIsBirthday(true);
                }
            }

            fetchFeed(userId);
        }
        setLoading(false);
    };

    const fetchFeed = async (userId: string) => {
        const socialPosts = await getPosts(userId);
        setPosts(socialPosts);
    };

    const handleCreatePost = async () => {
        if (!newPost.trim() || !user) return;
        setIsPosting(true);
        const res = await createPost(user.id, newPost);
        if (res.success) {
            setNewPost("");
            fetchFeed(user.id);
        }
        setIsPosting(false);
    };

    const handleToggleLike = async (postId: string) => {
        if (!user) return;
        const res = await toggleLike(postId, user.id);
        if (res.success) fetchFeed(user.id);
    };

    const handleAddComment = async (postId: string) => {
        const text = commentTexts[postId];
        if (!text?.trim() || !user) return;
        const res = await addComment(postId, user.id, text);
        if (res.success) {
            setCommentTexts({ ...commentTexts, [postId]: "" });
            fetchFeed(user.id);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (confirm("De-materialize this thought?")) {
            const res = await deletePost(postId);
            if (res.success) fetchFeed(user.id);
        }
    };

    const handleUpdatePost = async (postId: string) => {
        if (!editContent.trim()) return;
        const res = await updatePost(postId, editContent);
        if (res.success) {
            setEditingPost(null);
            fetchFeed(user.id);
        }
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setSaving(true);
        setStatus(null);

        let bday: Date | null = null;
        if (user.birthday) {
            const dateObj = new Date(user.birthday);
            if (!isNaN(dateObj.getTime())) {
                bday = dateObj;
            }
        }

        const res = await updateUserProfile(user.id, {
            displayName: user.displayName,
            bio: user.bio,
            hobbies: user.hobbies,
            hideProfile: user.hideProfile,
            profilePicture: user.profilePicture,
            birthday: bday,
            socialLinks: JSON.stringify(user.socialLinks || {})
        });

        if (res.success) {
            setStatus({ type: 'success', msg: 'Neural profile synchronized.' });
            const sessionData = {
                id: user.id,
                name: user.name,
                displayName: user.displayName,
                email: user.email
            };
            try {
                localStorage.setItem("vpoint-user", JSON.stringify(sessionData));
            } catch (e) {
                console.warn("Session cache quota exceeded, but DB updated.");
            }
        } else {
            setStatus({ type: 'error', msg: 'Sync failed: ' + (res.error || 'Server rejected the update.') });
        }
        setSaving(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedArea: any, pixels: any) => {
        setCroppedAreaPixels(pixels);
    };

    const confirmCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setUser({ ...user, profilePicture: croppedImage });
            setShowCropper(false);
            setImageSrc(null);
            setStatus({ type: 'success', msg: 'Avatar optimized. Commit to broadcast.' });
        } catch (e) {
            console.error(e);
            setStatus({ type: 'error', msg: 'Neural processing failed.' });
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-neon-cyan animate-pulse font-black uppercase tracking-[0.5em]">Calibrating Nexus...</div>;

    return (
        <div className="min-h-screen p-6 lg:p-20 space-y-12 pb-32">
            {/* Birthday Hub Overlay */}
            <AnimatePresence>
                {isBirthday && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass border border-neon-magenta/30 p-10 rounded-[3rem] bg-neon-magenta/5 relative overflow-hidden text-center space-y-6 mb-10"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 mx-auto bg-neon-magenta/20 rounded-full flex items-center justify-center text-neon-magenta shadow-[0_0_30px_rgba(255,45,85,0.3)]"
                        >
                            <Gift size={40} />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Happy <span className="text-neon-magenta">Birthday</span></h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Nexus Optimization Event Detected</p>
                        </div>
                        <p className="text-slate-400 text-sm italic max-w-md mx-auto">
                            The Viewpoint Matrix wishes you a productive solar iteration. Signal strength boosted for your special day.
                        </p>
                        <Sparkles className="absolute top-10 left-10 text-neon-cyan/20 animate-ping" size={48} />
                        <Sparkles className="absolute bottom-10 right-10 text-neon-magenta/20 animate-ping delay-500" size={48} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Nexus <span className="text-neon-cyan">Profile</span></h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Personal Data Management Sector</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/")}
                            className="px-8 py-5 bg-white/5 text-white border border-white/10 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3"
                        >
                            <X size={16} /> Close
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={saving}
                            className="px-10 py-5 bg-neon-cyan text-black rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] flex items-center gap-3 disabled:opacity-50"
                        >
                            <Save size={16} /> {saving ? "Syncing..." : "Commit Changes"}
                        </motion.button>
                    </div>
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                    >
                        {status.msg}
                    </motion.div>
                )}

                {/* Tab Navigation */}
                <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'profile' ? 'text-neon-cyan active-link' : 'text-slate-500 hover:text-white'}`}
                    >
                        Nexus Identity
                    </button>
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${activeTab === 'feed' ? 'text-neon-magenta active-link' : 'text-slate-500 hover:text-white'}`}
                    >
                        Neural Feed <span className="px-2 py-0.5 bg-neon-magenta/20 text-neon-magenta rounded-full text-[8px]">{posts.length}</span>
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left: Avatar & Identity */}
                        <div className="space-y-8">
                            <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/[0.02] text-center space-y-6">
                                <div className="relative inline-block group">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center text-slate-700 overflow-hidden">
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="profile-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => document.getElementById('profile-upload')?.click()}
                                        className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 transition-transform z-10"
                                    >
                                        <Camera size={16} />
                                    </motion.button>
                                </div>
                                <div className="space-y-1 text-center w-full">
                                    <h3 className="text-xl font-black text-white uppercase truncate px-4">{user?.displayName || user?.name}</h3>
                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest block text-center line-clamp-1 break-all px-2 overflow-hidden">{user?.email}</p>
                                </div>
                            </div>

                            {/* Social Links Grid */}
                            <div className="glass border border-white/10 rounded-[3rem] p-8 bg-white/[0.02] space-y-6">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest text-center">Social Interlinks</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'twt', icon: Twitter, color: 'text-blue-400', label: 'Twitter' },
                                        { id: 'fb', icon: Facebook, color: 'text-blue-600', label: 'Facebook' },
                                        { id: 'li', icon: LinkedIn, color: 'text-blue-700', label: 'LinkedIn' },
                                        { id: 'ig', icon: Instagram, color: 'text-pink-500', label: 'Instagram' }
                                    ].map(soc => (
                                        <div
                                            key={soc.id}
                                            onClick={() => setSocialModal(soc.id)}
                                            className={`p-4 glass-dark border rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all cursor-pointer ${user?.socialLinks?.[soc.id] ? 'border-neon-cyan/40 bg-neon-cyan/5' : 'border-white/5 hover:border-white/20'}`}
                                        >
                                            <soc.icon size={20} className={`${soc.color} group-hover:scale-110 transition-transform`} />
                                            <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">{soc.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Network Intel */}
                            <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Globe size={24} className="text-slate-700" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Location Vector</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-black">{user?.location || user?.country || "HIDDEN_VECTOR"}</p>
                                    </div>
                                </div>
                                <Share2 size={18} className="text-slate-700 hover:text-white transition-colors cursor-pointer" />
                            </div>
                        </div>

                        {/* Right: Data Entry & Broadcasts */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/[0.02] space-y-12">
                                {/* Core Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Identification</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                            <input
                                                type="text"
                                                value={user?.displayName || ""}
                                                onChange={(e) => setUser({ ...user, displayName: e.target.value })}
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black text-white focus:outline-none focus:border-neon-cyan/50 transition-all uppercase"
                                                placeholder="NEXUS_OPERATOR"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Solar Iteration</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                            <input
                                                type="date"
                                                value={user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ""}
                                                onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black text-white focus:outline-none focus:border-neon-cyan/50 transition-all uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural Bio</label>
                                    <textarea
                                        value={user?.bio || ""}
                                        onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-8 text-[11px] font-medium text-slate-400 focus:outline-none focus:border-neon-cyan/50 transition-all resize-none italic leading-relaxed"
                                        placeholder="Inject your life's code here..."
                                    />
                                </div>

                                {/* Interests */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                        <Heart size={10} className="text-neon-magenta" /> Matrix Interests
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.hobbies || ""}
                                        onChange={(e) => setUser({ ...user, hobbies: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 text-[10px] font-black text-white focus:outline-none focus:border-neon-magenta/50 transition-all uppercase"
                                        placeholder="CRICKET, CODING, CINEMA..."
                                    />
                                </div>

                                {/* Privacy Toggle */}
                                <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${user?.hideProfile ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            {user?.hideProfile ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Privacy Protocol</p>
                                            <p className="text-[9px] text-slate-500 font-medium">Currently {user?.hideProfile ? "INCÖGNITO" : "PUBLIC"}</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setUser({ ...user, hideProfile: !user.hideProfile })}
                                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${user?.hideProfile ? 'bg-amber-500 text-vpoint-dark border-amber-500' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                                    >
                                        {user?.hideProfile ? "GO PUBLIC" : "GO STEALTH"}
                                    </motion.button>
                                </div>

                                {/* Broadcast History (The new integrated section) */}
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Personal Broadcast History</h4>
                                        <span className="text-[9px] font-black text-neon-magenta uppercase tracking-widest">{posts.filter(p => p.userId === user?.id).length} Active Pulses</span>
                                    </div>

                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {posts.filter(p => p.userId === user?.id).length === 0 ? (
                                            <div className="p-10 border border-dashed border-white/10 rounded-[2rem] text-center space-y-3">
                                                <Sparkles className="mx-auto text-slate-800" size={32} />
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Signal silence detected</p>
                                            </div>
                                        ) : (
                                            posts.filter(p => p.userId === user?.id).map(post => (
                                                <div key={post.id} className="glass border border-white/5 rounded-2xl p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                                                                {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : <User size={14} className="text-slate-700" />}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-[9px] font-black text-white uppercase tracking-tight">{user?.displayName || user?.name}</h5>
                                                                <p className="text-[7px] text-slate-600 font-bold uppercase">{new Date(post.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPost(post.id);
                                                                    setEditContent(post.content);
                                                                }}
                                                                className="p-1.5 text-slate-700 hover:text-neon-cyan transition-colors"
                                                            >
                                                                <Edit3 size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePost(post.id)}
                                                                className="p-1.5 text-slate-700 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">{post.content}</p>
                                                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                                                        <div className="flex items-center gap-1.5 text-[8px] font-black text-neon-magenta uppercase tracking-widest">
                                                            <ThumbsUp size={10} className={post.hasLiked ? "fill-neon-magenta" : ""} /> {post.likes}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                                            <MessageSquare size={10} /> {post.comments?.length || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-12">
                        {/* Feed Tab Content */}
                        <div className="glass border border-white/10 rounded-[3rem] p-8 bg-white/[0.02] space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                    {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-700" />}
                                </div>
                                <textarea
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="Broadcast your thoughts to the matrix..."
                                    className="w-full bg-transparent border-none text-[13px] text-white focus:outline-none resize-none pt-2 h-24 placeholder:text-slate-600"
                                />
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Strength: 100%</p>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCreatePost}
                                    disabled={isPosting || !newPost.trim()}
                                    className="px-8 py-3 bg-neon-magenta text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,45,85,0.2)]"
                                >
                                    <Send size={14} /> {isPosting ? "Processing..." : "Broadcast Pulse"}
                                </motion.button>
                            </div>
                        </div>

                        {/* Neural Feed List */}
                        <div className="space-y-8 pb-32">
                            {posts.length === 0 ? (
                                <div className="text-center py-20 space-y-4">
                                    <Sparkles className="mx-auto text-slate-800" size={48} />
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Grid inactivity detected</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass border border-white/10 rounded-[2.5rem] p-8 bg-white/[0.02] space-y-6 group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                                                    {post.user?.profilePicture ? <img src={post.user.profilePicture} className="w-full h-full object-cover" /> : <User size={16} className="text-slate-700" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{post.user?.displayName || post.user?.name}</h4>
                                                    <p className="text-[9px] text-slate-600 font-bold uppercase">{new Date(post.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {post.userId === user?.id && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingPost(post.id);
                                                            setEditContent(post.content);
                                                        }}
                                                        className="p-2 text-slate-700 hover:text-neon-cyan transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {editingPost === post.id ? (
                                            <div className="space-y-4">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full bg-black/40 border border-neon-cyan/30 rounded-2xl p-6 text-[13px] text-white focus:outline-none"
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdatePost(post.id)} className="px-6 py-2 bg-neon-cyan text-black rounded-xl text-[9px] font-black uppercase">Sync</button>
                                                    <button onClick={() => setEditingPost(null)} className="px-6 py-2 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase">Abort</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-[13px] text-slate-300 leading-relaxed font-medium">{post.content}</p>
                                        )}

                                        <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => handleToggleLike(post.id)}
                                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${post.hasLiked ? 'text-neon-magenta' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                <ThumbsUp size={16} className={post.hasLiked ? "fill-neon-magenta" : ""} />
                                                {post.likes} <span className="hidden sm:inline">Upvotes</span>
                                            </button>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <MessageSquare size={16} />
                                                {post.comments?.length || 0} <span className="hidden sm:inline">Intel Fragments</span>
                                            </div>
                                        </div>

                                        {/* Comments Sector */}
                                        <div className="space-y-4 pt-4">
                                            {post.comments?.map((comment: any) => (
                                                <div key={comment.id} className="flex gap-3 bg-black/20 p-4 rounded-2xl border border-white/5 group/comment">
                                                    <div className="w-6 h-6 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {comment.user?.profilePicture ? <img src={comment.user.profilePicture} className="w-full h-full object-cover" /> : <User size={12} className="text-slate-700" />}
                                                    </div>
                                                    <div className="space-y-1 w-full relative">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-black text-white uppercase italic">{comment.user?.displayName || comment.user?.name}</span>
                                                            <span className="text-[8px] text-slate-700 font-black">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 font-medium">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex gap-3 pt-2">
                                                <input
                                                    type="text"
                                                    value={commentTexts[post.id] || ""}
                                                    onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                                                    placeholder="Inject a neural response..."
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-[10px] text-white focus:outline-none focus:border-neon-magenta/50"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                />
                                                <button onClick={() => handleAddComment(post.id)} className="p-3 bg-neon-magenta/10 text-neon-magenta rounded-xl hover:bg-neon-magenta/20 transition-all">
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Global Modals */}
            <AnimatePresence>
                {socialModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSocialModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm glass border border-white/10 rounded-[2.5rem] p-10 space-y-8 bg-vpoint-dark shadow-2xl">
                            <div className="space-y-2 text-center">
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Update <span className="text-neon-cyan">Interlink</span></h4>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Protocol Alignment Required</p>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural Endpoint (URL/Username)</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={user?.socialLinks?.[socialModal] || ""}
                                    onChange={(e) => setUser({
                                        ...user,
                                        socialLinks: { ...user.socialLinks, [socialModal]: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-[10px] font-black text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                                    placeholder="https://matrix.path/..."
                                />
                            </div>
                            <button onClick={() => setSocialModal(null)} className="w-full py-5 bg-neon-cyan text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Confirm Endpoint</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCropper && imageSrc && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl aspect-square glass border border-white/10 rounded-[4rem] overflow-hidden bg-vpoint-dark flex flex-col shadow-2xl">
                            <div className="relative flex-1 bg-black/60">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={handleCropComplete}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>
                            <div className="p-10 space-y-8 bg-vpoint-dark/95 backdrop-blur-md">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                                        <span>Optical Zoom</span>
                                        <span className="text-neon-cyan">{Math.round(zoom * 100)}%</span>
                                    </div>
                                    <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan" />
                                </div>
                                <div className="flex gap-6">
                                    <button onClick={() => { setShowCropper(false); setImageSrc(null); }} className="flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Abort</button>
                                    <button onClick={confirmCrop} className="flex-1 py-5 bg-neon-cyan text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all">Optimize Avatar</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

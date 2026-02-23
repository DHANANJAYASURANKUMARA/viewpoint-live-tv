"use client";

import React, { useState, useEffect } from "react";
import { X, User, Facebook, Twitter, Linkedin, Instagram, MapPin, UserPlus, MessageSquare, Shield, ShieldAlert, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { getUserProfile, sendFriendRequest, handleFriendRequest, getFriends } from "@/lib/actions";

interface ProfileModalProps {
    userId: string;
    currentUser: { id: string; name: string };
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ userId, currentUser, isOpen, onClose }: ProfileModalProps) {
    const [profile, setProfile] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
    const [friendshipRelation, setFriendshipRelation] = useState<Record<string, any> | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const loadProfile = React.useCallback(async () => {
        setLoading(true);
        const data = await getUserProfile(userId) as Record<string, any>;
        if (data) {
            // Parse social links
            try {
                if (data.socialLinks) data.socials = JSON.parse(data.socialLinks);
                else data.socials = {};
            } catch {
                data.socials = {};
            }
            setProfile(data);

            // Check friendship
            const friends = await getFriends(currentUser.id);
            const relation = friends.find(f => f.requesterId === userId || f.receiverId === userId);
            setFriendshipRelation(relation || null);
            setFriendshipStatus(relation ? relation.status : null);
        }
        setLoading(false);
    }, [userId, currentUser.id]);

    useEffect(() => {
        if (isOpen && userId) {
            Promise.resolve().then(() => loadProfile());
        }
    }, [isOpen, userId, loadProfile]);

    const handleAddFriend = async () => {
        setIsProcessing(true);
        const res = await sendFriendRequest(currentUser.id, userId);
        if (res.success) {
            setFriendshipStatus('PENDING');
            setFriendshipRelation({ requesterId: currentUser.id, receiverId: userId, status: 'PENDING' });
        }
        setIsProcessing(false);
    };

    const handleAcceptRequest = async () => {
        if (!friendshipRelation) return;
        setIsProcessing(true);
        const res = await handleFriendRequest(friendshipRelation.id, 'ACCEPTED');
        if (res.success) {
            setFriendshipStatus('ACCEPTED');
        }
        setIsProcessing(false);
    };

    const openSocial = (url: string) => {
        if (!url) return;
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(fullUrl, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass border border-white/10 rounded-[3rem] overflow-hidden bg-vpoint-dark shadow-2xl"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors z-10"
                >
                    <X size={18} />
                </button>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Decrypting Profile...</p>
                    </div>
                ) : profile ? (
                    <div className="flex flex-col">
                        {/* Header / Banner Area */}
                        <div className="h-32 bg-gradient-to-br from-neon-cyan/20 via-neon-magenta/10 to-transparent relative">
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Profile Info */}
                        <div className="px-10 pb-10 -mt-16 relative">
                            <div className="flex flex-col items-center text-center space-y-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-vpoint-dark border-4 border-vpoint-dark shadow-2xl overflow-hidden flex items-center justify-center">
                                        {profile.profilePicture ? (
                                            <img src={profile.profilePicture} alt={profile.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} className="text-slate-700" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-vpoint-dark" />
                                </div>

                                {/* Identity */}
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                        {profile.displayName || profile.name}
                                    </h2>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Nexus Operator</p>
                                </div>

                                {/* Privacy Badge */}
                                <div className={`px-4 py-1 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-2 ${profile.isPrivate ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {profile.isPrivate ? <ShieldAlert size={10} /> : <Globe size={10} />}
                                    {profile.isPrivate ? 'Restricted Profile' : 'Public Profile'}
                                </div>

                                {/* Bio */}
                                <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed max-w-sm">
                                    {profile.bio || "No neural description provided."}
                                </p>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                                    <MapPin size={12} className="text-neon-cyan" />
                                    <span>{profile.location || profile.country || "Edge of the Matrix"}</span>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4">
                                    {profile.socials?.fb && <Facebook size={18} onClick={() => openSocial(profile.socials.fb)} className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" />}
                                    {profile.socials?.twt && <Twitter size={18} onClick={() => openSocial(profile.socials.twt)} className="text-blue-400 cursor-pointer hover:scale-110 transition-transform" />}
                                    {profile.socials?.li && <Linkedin size={18} onClick={() => openSocial(profile.socials.li)} className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" />}
                                    {profile.socials?.ig && <Instagram size={18} onClick={() => openSocial(profile.socials.ig)} className="text-pink-500 cursor-pointer hover:scale-110 transition-transform" />}
                                </div>

                                {/* Actions */}
                                {currentUser.id !== userId && (
                                    <div className="w-full grid grid-cols-2 gap-4 pt-4">
                                        {friendshipStatus === 'ACCEPTED' ? (
                                            <div className="col-span-2 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-3 text-emerald-400">
                                                <Shield size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Active</span>
                                            </div>
                                        ) : friendshipStatus === 'PENDING' ? (
                                            friendshipRelation?.receiverId === currentUser.id ? (
                                                <button
                                                    onClick={handleAcceptRequest}
                                                    disabled={isProcessing}
                                                    className="col-span-2 p-4 bg-emerald-500 text-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
                                                >
                                                    <Shield size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Establish Link</span>
                                                </button>
                                            ) : (
                                                <div className="col-span-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center gap-3 text-amber-400">
                                                    <ShieldAlert size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Synchronization</span>
                                                </div>
                                            )
                                        ) : (
                                            <button
                                                onClick={handleAddFriend}
                                                disabled={isProcessing}
                                                className="p-4 bg-neon-cyan text-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
                                            >
                                                <UserPlus size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Add Link</span>
                                            </button>
                                        )}
                                        <button className="p-4 glass-dark border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white hover:border-white/30 transition-all">
                                            <MessageSquare size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Transmit DM</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center space-y-4">
                        <ShieldAlert size={48} className="mx-auto text-red-500" />
                        <p className="text-sm text-slate-400">Operator not found in the matrix.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

"use client";

import {
  AlertTriangle,
  Ban,
  CheckCheck,
  ChevronDown,
  CircleOff,
  Flag,
  Heart,
  MessageCircleHeart,
  MoreHorizontal,
  Paperclip,
  RotateCcw,
  Send,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Video,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { seededMessages, topics } from "@/data/seed";
import type { Message } from "@/lib/domain";

interface ChatRoomProps {
  alias: string;
  topicId: string;
  onEnd: () => void;
}

type ConnectionState = "connected" | "reconnecting" | "offline" | "error";

const replies = [
  "That sounds like a useful experiment. What is the smallest version you could try this week?",
  "You don’t have to decide the whole future today. What information would make the next step clearer?",
  "I hear both the curiosity and the risk. Which part of the risk is reversible?",
];

export function ChatRoom({ alias, topicId, onEnd }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(seededMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set(["msg-2"]));
  const [reactionIds, setReactionIds] = useState<Set<string>>(new Set());
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [seconds, setSeconds] = useState(12 * 60 + 8);
  const [connection, setConnection] = useState<ConnectionState>("connected");
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const timersRef = useRef<number[]>([]);
  const listEndRef = useRef<HTMLDivElement>(null);
  const endDialogRef = useRef<HTMLDivElement>(null);
  const replyIndexRef = useRef(0);
  const topic = topics.find((item) => item.id === topicId) ?? topics[0];

  useEffect(() => {
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, typing]);

  useEffect(() => {
    if (!endOpen) return;
    endDialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEndOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [endOpen]);

  const formatTime = (value: number) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;

  const sendMessage = () => {
    const body = draft.trim();
    if (!body || connection !== "connected") return;
    const id = `msg-local-${Date.now()}`;
    setMessages((current) => [
      ...current,
      {
        id,
        conversationId: "conversation-demo",
        participantId: "participant-seeker",
        body,
        sentAt: new Date().toISOString(),
        deliveryState: "delivered",
      },
    ]);
    setDraft("");
    setTyping(true);
    const timer = window.setTimeout(() => {
      const reply = replies[replyIndexRef.current % replies.length];
      replyIndexRef.current += 1;
      setMessages((current) => [
        ...current,
        {
          id: `msg-reply-${Date.now()}`,
          conversationId: "conversation-demo",
          participantId: "participant-advisor",
          body: reply,
          sentAt: new Date().toISOString(),
          deliveryState: "read",
        },
      ]);
      setTyping(false);
    }, 1100);
    timersRef.current.push(timer);
  };

  const toggleHelpful = (id: string) => {
    setHelpfulIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleReaction = (id: string) => {
    setReactionIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const flagMessage = (id: string) => {
    setFlaggedIds((current) => new Set(current).add(id));
    setNotice("Message flagged privately. Ember 42 is not notified.");
  };

  const connectionContent = {
    connected: { icon: Wifi, text: "Connected", tone: "connected" },
    reconnecting: { icon: RotateCcw, text: "Reconnecting…", tone: "warning" },
    offline: { icon: CircleOff, text: "Offline · drafts stay here", tone: "warning" },
    error: { icon: AlertTriangle, text: "Send failed · try reconnecting", tone: "error" },
  }[connection];
  const ConnectionIcon = connectionContent.icon;

  return (
    <section className="chat-frame" aria-label="Private conversation">
      <header className="chat-header">
        <div className="chat-person">
          <Avatar seed="ember" size="medium" pulse={connection === "connected"} />
          <div><span className="step-label">Private peer room</span><strong>Ember 42</strong></div>
        </div>
        <div className="chat-topic">
          <span>{topic.label}</span>
          <strong>{formatTime(seconds)}</strong>
          <small>Session timer</small>
        </div>
        <div className="chat-controls">
          <button className="connection-control" type="button" onClick={() => setConnection((value) => value === "connected" ? "reconnecting" : value === "reconnecting" ? "error" : "connected")} aria-label="Cycle prototype connection state">
            <ConnectionIcon size={13} /><span>{connectionContent.text}</span>
          </button>
          <button className="icon-button future-control" type="button" disabled aria-label="Video is a future feature and is off"><Video size={17} /></button>
          <div className="safety-menu-wrap">
            <button className="icon-button" type="button" onClick={() => setSafetyOpen((value) => !value)} aria-expanded={safetyOpen} aria-label="Conversation safety options"><MoreHorizontal size={18} /></button>
            {safetyOpen && (
              <div className="safety-menu">
                <button type="button" onClick={() => { setNotice("Conversation reported privately for moderator triage."); setSafetyOpen(false); }}><Flag size={15} /><span><strong>Report conversation</strong><small>Private moderator review</small></span></button>
                <button type="button" onClick={() => { setConnection("offline"); setNotice("Ember 42 is blocked. This room can no longer reconnect."); setSafetyOpen(false); }}><Ban size={15} /><span><strong>Block Ember 42</strong><small>End future contact</small></span></button>
              </div>
            )}
          </div>
          <button className="button button-secondary button-small end-button" type="button" onClick={() => setEndOpen(true)}>End session</button>
        </div>
      </header>

      <div className={`connection-banner connection-${connectionContent.tone}`} role="status">
        <ConnectionIcon size={14} /> {connectionContent.text}
        {connection !== "connected" && <button type="button" onClick={() => setConnection("connected")}>Reconnect</button>}
      </div>

      <div className="session-arc" aria-label="Conversation phase: exploring">
        <span className="complete">Arrive</span><span className="active">Explore</span><span>Find a takeaway</span>
      </div>

      <div className="chat-layout">
        <aside className="chat-aside">
          <div>
            <span className="step-label"><Sparkles size={12} /> A gentle place to begin</span>
            <h2>You do not have to explain everything at once.</h2>
          </div>
          <div className="starter-list">
            {["What helped you when this felt uncertain?", "What would you test before making a big change?", "What do you wish you had known sooner?"].map((starter) => (
              <button type="button" key={starter} onClick={() => setDraft(starter)}>{starter}<ChevronDown size={13} /></button>
            ))}
          </div>
          <div className="chat-safety-note"><ShieldCheck size={16} /><p><strong>A note about peer guidance</strong>Experience can offer perspective, but it is not automatically professional advice.</p></div>
        </aside>

        <div className="chat-main">
          <div className="message-list" aria-live="polite" aria-label="Conversation messages">
            <div className="message-date"><span>Today · private to this room</span></div>
            {messages.length === 0 && (
              <div className="empty-chat"><MessageCircleHeart size={28} /><strong>Make room for a real answer.</strong><span>Choose a starter or write what feels most important.</span></div>
            )}
            {messages.map((message) => {
              const self = message.participantId === "participant-seeker";
              const isHelpful = helpfulIds.has(message.id);
              return (
                <div className={`message-row ${self ? "message-row-self" : ""}`} key={message.id}>
                  {!self && <Avatar seed="ember" size="small" />}
                  <div className="message-stack">
                    <div className="message-meta"><strong>{self ? alias : "Ember 42"}</strong><span>{new Date(message.sentAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></div>
                    <div className="message-bubble">
                      <p>{message.body}</p>
                      {flaggedIds.has(message.id) && <span className="flagged-label"><Flag size={11} /> Flagged privately</span>}
                    </div>
                    <div className="message-tools">
                      <button className={isHelpful ? "active" : ""} type="button" onClick={() => toggleHelpful(message.id)} aria-pressed={isHelpful}><Heart size={13} fill={isHelpful ? "currentColor" : "none"} /> Helpful</button>
                      <button className={reactionIds.has(message.id) ? "active" : ""} type="button" onClick={() => toggleReaction(message.id)} aria-pressed={reactionIds.has(message.id)}><SmilePlus size={13} /> Thanks</button>
                      <button type="button" onClick={() => flagMessage(message.id)} disabled={flaggedIds.has(message.id)}><Flag size={12} /> Flag</button>
                      {self && <span className="delivery-state"><CheckCheck size={13} /> Read</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="message-row typing-row">
                <Avatar seed="ember" size="small" pulse />
                <div className="typing-indicator" aria-label="Ember 42 is typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={listEndRef} />
          </div>

          {notice && <div className="inline-notice" role="status"><ShieldCheck size={14} /> {notice}<button type="button" onClick={() => setNotice("")}>Dismiss</button></div>}

          <div className="message-composer">
            <label className="sr-only" htmlFor="message-draft">Message Ember 42</label>
            <textarea
              id="message-draft"
              rows={2}
              placeholder={connection === "connected" ? "Write what feels true…" : "Reconnect to send a message"}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              disabled={connection !== "connected"}
            />
            <div className="composer-actions">
              <button className="icon-button" type="button" disabled aria-label="File attachments are disabled in this prototype"><Paperclip size={16} /></button>
              <span>Enter to send · Shift+Enter for a new line</span>
              <button className="send-button" type="button" onClick={sendMessage} disabled={!draft.trim() || connection !== "connected"} aria-label="Send message"><Send size={17} /></button>
            </div>
          </div>
        </div>
      </div>

      {endOpen && (
        <div className="dialog-backdrop" role="presentation">
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="end-title" aria-describedby="end-description" ref={endDialogRef} tabIndex={-1}>
            <span className="dialog-icon"><MessageCircleHeart size={22} /></span>
            <h2 id="end-title">Ready to end this session?</h2>
            <p id="end-description">You will each reflect privately. Neither person sees the other’s answers until both have responded—and consent choices remain private.</p>
            <div className="dialog-actions">
              <button className="button button-secondary" type="button" onClick={() => setEndOpen(false)}>Keep talking</button>
              <button className="button button-primary" type="button" onClick={onEnd}>End and reflect</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

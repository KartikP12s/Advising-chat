"use client";

import { Heart, LockKeyhole, MessageCircleMore, Sparkles } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/avatar";

export function LandingPreview() {
  const [helpful, setHelpful] = useState(false);

  return (
    <div className="product-preview" aria-label="Interactive private conversation preview">
      <div className="preview-topbar">
        <div>
          <span className="eyebrow eyebrow-small"><LockKeyhole size={12} /> Private room</span>
          <strong>Changing direction without starting over</strong>
        </div>
        <span className="connection-dot">Connected</span>
      </div>
      <div className="preview-stage">
        <div className="preview-person preview-person-left">
          <Avatar seed="moss" size="small" />
          <span>Moss 28</span>
        </div>
        <div className="preview-chat">
          <div className="mini-bubble mini-bubble-self">
            I’m worried one wrong move will erase everything I’ve built.
          </div>
          <div className="mini-bubble">
            What if your next move were an experiment—not a verdict?
            <button
              className={`helpful-button ${helpful ? "is-helpful" : ""}`}
              type="button"
              onClick={() => setHelpful((value) => !value)}
              aria-pressed={helpful}
            >
              <Heart size={13} fill={helpful ? "currentColor" : "none"} />
              {helpful ? "Marked helpful" : "This helped"}
            </button>
          </div>
        </div>
        <div className="preview-person preview-person-right">
          <Avatar seed="ember" size="small" pulse />
          <span>Ember 42</span>
        </div>
      </div>
      <div className="preview-footer">
        <span><MessageCircleMore size={15} /> Conversation first</span>
        <span className="preview-divider" />
        <span><Sparkles size={15} /> Sharing only if both agree</span>
      </div>
    </div>
  );
}

package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.common.util.ImageLink;
import com.sagasu.lostandfound_backend.dto.ClaimDecisionRequest;
import com.sagasu.lostandfound_backend.dto.ClaimExchangeResponse;
import com.sagasu.lostandfound_backend.dto.ClaimInfoRequest;
import com.sagasu.lostandfound_backend.dto.ClaimResponse;
import com.sagasu.lostandfound_backend.dto.HandoverResponse;
import com.sagasu.lostandfound_backend.dto.SubmitClaimRequest;
import com.sagasu.lostandfound_backend.entity.*;
import com.sagasu.lostandfound_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimService {
    private final ClaimRepository claims;
    private final ItemRepository items;
    private final ChatRoomRepository rooms;
    private final HandoverRepository handovers;
    private final NotificationService notifications;
    private final ClaimExchangeRepository exchanges;

    @Transactional
    public ClaimResponse submit(UUID claimerId, UUID foundItemId, SubmitClaimRequest request) {
        if (request == null || request.getIdentifyingDetails() == null || request.getIdentifyingDetails().isBlank()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Identifying details are required");
        }
        Item found = items.findById(foundItemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        if (found.getItemType() != ItemType.FOUND || found.getUser().getId().equals(claimerId)
                || found.getStatus() == ItemStatus.CLOSED || found.getStatus() == ItemStatus.RETURNED
                || found.getStatus() == ItemStatus.IN_DISCUSSION) {
            throw new AppException(ErrorCode.BAD_REQUEST, "This item cannot be claimed");
        }
        if (request.getLostItemId() != null) {
            Item lost = items.findById(request.getLostItemId()).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
            if (lost.getItemType() != ItemType.LOST || !lost.getUser().getId().equals(claimerId)
                    || lost.getStatus() == ItemStatus.CLOSED || lost.getStatus() == ItemStatus.RETURNED) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Linked Lost post is not eligible");
            }
        }
        Claim claim = claims.save(Claim.builder().foundItemId(foundItemId).lostItemId(request.getLostItemId())
                .claimerId(claimerId).identifyingDetails(request.getIdentifyingDetails().trim())
                .additionalPhotoUrl(ImageLink.validate(request.getEvidenceImageUrl()))
                .contactPhone(request.getContactPhone()).contactEmail(request.getContactEmail())
                .note(request.getNote()).build());
        found.setStatus(ItemStatus.CLAIM_PENDING);
        items.save(found);
        notifications.create(found.getUser().getId(), "NEW_CLAIM", "CLAIM", claim.getId(), "A claim was submitted for your item");
        return ClaimResponse.from(claim);
    }

    @Transactional
    public ClaimResponse respond(UUID finderId, UUID claimId, ClaimDecisionRequest request) {
        Claim claim = getEntity(claimId);
        Item found = items.findById(claim.getFoundItemId()).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        if (!found.getUser().getId().equals(finderId)) throw new AppException(ErrorCode.FORBIDDEN);
        if (claim.getStatus() != ClaimStatus.WAITING_FINDER_VERIFICATION
                && claim.getStatus() != ClaimStatus.REQUEST_MORE_INFO) {
            throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        }
        ClaimStatus decision = request == null ? null : request.getDecision();
        String note = request == null ? null : request.getResponseNote();
        if (decision == null || decision == ClaimStatus.WAITING_FINDER_VERIFICATION) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        if (decision == ClaimStatus.REQUEST_MORE_INFO && (note == null || note.isBlank())) {
            throw new AppException(ErrorCode.BAD_REQUEST, "A question is required");
        }
        claim.setStatus(decision);
        claim.setResponseNote(note);
        if (decision == ClaimStatus.APPROVED || decision == ClaimStatus.REJECTED) {
            claim.setDecidedAt(Instant.now());
        }
        claims.save(claim);
        if (decision == ClaimStatus.REQUEST_MORE_INFO) {
            exchanges.save(ClaimExchange.builder().claimId(claimId).senderId(finderId).content(note.trim()).build());
        }
        notifications.create(claim.getClaimerId(), "CLAIM_RESPONSE", "CLAIM", claimId,
                "The finder responded to your claim");
        if (decision == ClaimStatus.APPROVED) {
            found.setStatus(ItemStatus.IN_DISCUSSION);
            items.save(found);
            if (claim.getLostItemId() != null) {
                Item lost = items.findById(claim.getLostItemId()).orElseThrow();
                lost.setStatus(ItemStatus.IN_DISCUSSION);
                items.save(lost);
            }
            rooms.save(ChatRoom.builder().claimId(claimId).build());
            for (Claim other : claims.findByFoundItemIdOrderByCreatedAtDesc(found.getId())) {
                if (!other.getId().equals(claimId)) {
                    if (other.getStatus() != ClaimStatus.WAITING_FINDER_VERIFICATION
                            && other.getStatus() != ClaimStatus.REQUEST_MORE_INFO) continue;
                    other.setStatus(ClaimStatus.REJECTED);
                    other.setResponseNote("Another claim was approved");
                    other.setDecidedAt(Instant.now());
                    claims.save(other);
                }
            }
        } else if (decision == ClaimStatus.REJECTED
                && claims.findByFoundItemIdAndStatus(found.getId(), ClaimStatus.WAITING_FINDER_VERIFICATION).isEmpty()
                && claims.findByFoundItemIdAndStatus(found.getId(), ClaimStatus.REQUEST_MORE_INFO).isEmpty()) {
            found.setStatus(ItemStatus.FOUND);
            items.save(found);
        }
        return ClaimResponse.from(claim);
    }

    @Transactional
    public ClaimExchangeResponse addInfo(UUID claimerId, UUID claimId, ClaimInfoRequest request) {
        Claim claim = getEntity(claimId);
        if (!claim.getClaimerId().equals(claimerId)) throw new AppException(ErrorCode.FORBIDDEN);
        if (claim.getStatus() != ClaimStatus.REQUEST_MORE_INFO) {
            throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        }
        String content = request == null ? null : request.getContent();
        if (content == null || content.isBlank()) throw new AppException(ErrorCode.BAD_REQUEST);
        ClaimExchange reply = exchanges.save(ClaimExchange.builder().claimId(claimId)
                .senderId(claimerId).content(content.trim()).build());
        claim.setStatus(ClaimStatus.WAITING_FINDER_VERIFICATION);
        claims.save(claim);
        UUID finderId = items.findById(claim.getFoundItemId()).orElseThrow().getUser().getId();
        notifications.create(finderId, "CLAIM_INFO", "CLAIM", claimId, "A claimant supplied more information");
        return ClaimExchangeResponse.from(reply);
    }

    public List<ClaimExchangeResponse> exchanges(UUID actorId, UUID claimId) {
        getForUser(actorId, claimId);
        return exchanges.findByClaimIdOrderByCreatedAtAsc(claimId).stream()
                .map(ClaimExchangeResponse::from).toList();
    }

    @Transactional
    public HandoverResponse proposeHandover(UUID actorId, UUID claimId) {
        Claim claim = approvedClaim(claimId);
        requireParticipant(actorId, claim);
        if (handovers.findByClaimId(claimId).isPresent()) throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        return HandoverResponse.from(
                handovers.save(Handover.builder().claimId(claimId).proposedBy(actorId).build()));
    }

    @Transactional
    public HandoverResponse confirmHandover(UUID actorId, UUID claimId) {
        Claim claim = approvedClaim(claimId);
        requireParticipant(actorId, claim);
        Handover handover = handovers.findByClaimId(claimId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_STATE_TRANSITION));
        if (!"PROPOSED".equals(handover.getStatus()) || actorId.equals(handover.getProposedBy())) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        handover.setStatus("CONFIRMED");
        handover.setConfirmedBy(actorId);
        handover.setConfirmedAt(Instant.now());
        Item found = items.findById(claim.getFoundItemId()).orElseThrow();
        found.setStatus(ItemStatus.RETURNED);
        items.save(found);
        if (claim.getLostItemId() != null) {
            Item lost = items.findById(claim.getLostItemId()).orElseThrow();
            lost.setStatus(ItemStatus.RETURNED);
            items.save(lost);
        }
        ChatRoom room = rooms.findByClaimId(claimId).orElseThrow();
        room.setClosed(true);
        room.setClosedAt(Instant.now());
        rooms.save(room);
        notifications.create(handover.getProposedBy(), "HANDOVER_CONFIRMED", "CLAIM", claimId,
                "The item return was confirmed");
        return HandoverResponse.from(handovers.save(handover));
    }

    private Claim getEntity(UUID claimId) {
        return claims.findById(claimId).orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST, "Claim not found"));
    }

    public ClaimResponse getForUser(UUID actorId, UUID claimId) {
        Claim claim = getEntity(claimId);
        requireParticipant(actorId, claim);
        return ClaimResponse.from(claim);
    }

    public List<ClaimResponse> sent(UUID claimerId) {
        return claims.findByClaimerIdOrderByCreatedAtDesc(claimerId).stream()
                .map(ClaimResponse::from).toList();
    }

    public List<ClaimResponse> received(UUID finderId) {
        return items.findByUserId(finderId).stream()
                .flatMap(i -> claims.findByFoundItemIdOrderByCreatedAtDesc(i.getId()).stream())
                .map(ClaimResponse::from).toList();
    }

    private Claim approvedClaim(UUID claimId) {
        Claim claim = getEntity(claimId);
        if (claim.getStatus() != ClaimStatus.APPROVED) throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        return claim;
    }

    private void requireParticipant(UUID actorId, Claim claim) {
        UUID finderId = items.findById(claim.getFoundItemId()).orElseThrow().getUser().getId();
        if (!actorId.equals(claim.getClaimerId()) && !actorId.equals(finderId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
    }
}

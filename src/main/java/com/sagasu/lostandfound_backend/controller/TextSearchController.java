package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.api.PageResponse;
import com.sagasu.lostandfound_backend.dto.ItemResponse;
import com.sagasu.lostandfound_backend.dto.TextSearchRequest;
import com.sagasu.lostandfound_backend.service.ItemService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class TextSearchController {
    private final ItemService items;

    @PostMapping("/api/v1/search/text")
    public ApiResponse<PageResponse<ItemResponse>> search(@RequestBody TextSearchRequest request) {
        int page = request.getPage() == null ? 0 : request.getPage();
        int size = request.getSize() == null ? 10 : request.getSize();
        return ApiResponse.ok(items.getItems(request.getType(), request.getStatus(), request.getCategory(),
                request.getKeyword(), request.getProvinceCode(), request.getFromDate(), request.getToDate(),
                ItemController.searchPage(page, size, "createdAt", "desc")));
    }
}

import { useState, useEffect, useCallback } from 'react';
import { ItemDetailComponent } from './item-detail';
import { useRouter } from 'next/router';

import { INFT } from '../nft-list/types';
import { fetchTokenById } from '../../../utils/contractHelper';

export const ItemDetail = () => {
  const [loadedNft, setLoadedNft] = useState<INFT>();
  const router = useRouter();

  const getAsString = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  };

  const loadNFTByTokenId = useCallback(async () => {
    const { tokenId } = router.query;
    if (!tokenId) return;
    const item = await fetchTokenById(parseInt(getAsString(tokenId)));
    if (!item) {
      throw new Error('Something went wrong, please try again.');
    }
    setLoadedNft(item);
  }, [router.query]);

  useEffect(() => {
    loadNFTByTokenId();
  }, [loadNFTByTokenId]);

  return <ItemDetailComponent nft={loadedNft} />;
};

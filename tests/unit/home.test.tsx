import { render,screen } from '@testing-library/react';import { expect,it } from 'vitest';import { CategoryTiles } from '@/components/home/CategoryTiles';
it('links to the four homepage collection categories',()=>{render(<CategoryTiles/>);for(const name of ['Photocards','Albums','Bundles','Sold archive'])expect(screen.getByRole('link',{name:new RegExp(name,'i')})).toBeInTheDocument()});
